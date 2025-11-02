import Anthropic from '@anthropic-ai/sdk';
import Logger from '../core/Logger.js';
import supabase from '../config/supabase.js';
import { buildSystemPrompt } from './ai/systemPrompts.js';

const logger = new Logger('iAstedService');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let anthropic = null;
let openai = null;
let gemini = null;

if (ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  logger.info(`iAsted configured with Anthropic model: ${ANTHROPIC_MODEL}`);
} else {
  logger.warn('ANTHROPIC_API_KEY not configured. iAsted will use fallback mode.');
}

// Conserver pour usage futur (STT/TTS)
if (OPENAI_API_KEY) {
  logger.info('OpenAI configured (Whisper/TTS ready)');
}

if (GEMINI_API_KEY) {
  logger.info('Gemini configured (Long docs ready)');
}

async function getDashboardContext(userId) {
  try {
    // Récupérer contexte du dashboard
    const [kpis, alerts, provinces] = await Promise.all([
      supabase.from('dashboard_kpis').select('*').eq('periode', 'mois').limit(5),
      supabase.from('dashboard_alerts').select('*').eq('statut', 'active').limit(5),
      supabase.from('dashboard_provinces').select('*').limit(9),
    ]);

    const context = {
      kpis: kpis.data || [],
      alerts: alerts.data || [],
      provinces: provinces.data || [],
      timestamp: new Date().toISOString(),
    };

    return context;
  } catch (error) {
    logger.error('Error fetching dashboard context:', error);
    return null;
  }
}

export async function chatWithIAsted(messages, userId, userRole = 'MINISTRE') {
  if (!anthropic) {
    logger.warn('iAsted fallback mode - returning simulated response');
    return {
      response: `En tant qu'assistant ministériel iAsted, j'ai analysé votre demande. 
      
⚠️ Mode simulation (clé API Anthropic non configurée).

Pour activer iAsted en mode réel :
1. Créer un compte sur https://console.anthropic.com
2. Générer une clé API
3. Ajouter dans .env : ANTHROPIC_API_KEY=sk-ant-...
4. Redémarrer le serveur

En mode réel, je pourrai analyser vos données de santé, générer des rapports PDF, rédiger des décrets et fournir des recommandations stratégiques basées sur le dashboard.`,
      mode: 'fallback',
    };
  }

  try {
    const context = await getDashboardContext(userId);
    
    // Build system prompt avec RBAC et context
    const dashboardContext = context ? {
      kpis_count: context.kpis.length,
      alerts_count: context.alerts.length,
      provinces_count: context.provinces.length,
      avg_coverage: context.provinces.reduce((sum, p) => sum + (p.couverture || 0), 0) / (context.provinces.length || 1),
      priority_provinces: context.provinces.filter(p => p.couverture < 70).map(p => p.nom),
      recent_kpis: context.kpis.slice(0, 3).map(k => ({ nom: k.nom, valeur: k.valeur, delta: k.delta })),
      active_alerts: context.alerts.map(a => ({ titre: a.titre, severity: a.severity, province: a.province })),
    } : null;

    const systemPrompt = buildSystemPrompt(userRole, dashboardContext);

    const response = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    });

    const assistantMessage = response.content[0].text;
    logger.info(`iAsted response generated (${assistantMessage.length} chars)`);

    return {
      response: assistantMessage,
      mode: 'anthropic',
      model: ANTHROPIC_MODEL,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
      },
    };
  } catch (error) {
    logger.error('Error calling Anthropic API:', error);
    throw error;
  }
}

export async function generateReport(reportType, userId) {
  if (!anthropic) {
    return {
      content: `Rapport ${reportType} (mode simulation)\n\n⚠️ Configuration Anthropic requise pour génération réelle.`,
      mode: 'fallback',
    };
  }

  try {
    const context = await getDashboardContext(userId);

    const prompt = `En tant qu'assistant ministériel, génère un rapport ${reportType} pour le Ministre de la Santé du Gabon.

DONNÉES ACTUELLES :
${context ? JSON.stringify(context, null, 2) : 'Non disponibles'}

FORMAT DU RAPPORT :
- Titre professionnel
- Synthèse exécutive
- Analyses par indicateur
- Recommandations prioritaires
- Conclusion et prochaines étapes

Longueur : 500-800 mots, format Markdown.`;

    const response = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const reportContent = response.content[0].text;
    logger.info(`Report generated: ${reportType} (${reportContent.length} chars)`);

    return {
      content: reportContent,
      mode: 'anthropic',
      model: ANTHROPIC_MODEL,
      type: reportType,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    logger.error('Error generating report:', error);
    throw error;
  }
}

export default {
  chatWithIAsted,
  generateReport,
};

