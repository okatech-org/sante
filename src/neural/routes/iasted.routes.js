import express from 'express';
import multer from 'multer';
import { chatWithIAsted, generateReport } from '../services/iasted.service.js';
import Logger from '../core/Logger.js';

const router = express.Router();
const logger = new Logger('iAstedRoutes');
const upload = multer();

// POST /api/dashboard/iasted/transcribe
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const audioFile = req.file;
    
    if (!audioFile) {
      return res.status(400).json({
        success: false,
        error: 'Audio file required',
      });
    }

    logger.info(`Transcription request received (${audioFile.size} bytes)`);

    // Mode fallback : simulation transcription
    // TODO: Implémenter OpenAI Whisper quand OPENAI_API_KEY configuré
    if (!process.env.OPENAI_API_KEY) {
      logger.warn('Transcription fallback mode (OpenAI not configured)');
      
      // Simuler une transcription basique
      const fallbackTexts = [
        "Analyse la couverture sanitaire nationale",
        "Quelles sont les provinces prioritaires ?",
        "Génère un rapport sur la situation actuelle",
        "Donne-moi les recommandations pour améliorer le système",
      ];
      
      const randomText = fallbackTexts[Math.floor(Math.random() * fallbackTexts.length)];
      
      return res.json({
        success: true,
        text: randomText,
        mode: 'fallback',
        message: 'Transcription simulée. Configurez OPENAI_API_KEY pour transcription réelle.',
      });
    }

    // Mode réel avec OpenAI Whisper (à implémenter)
    // const transcription = await openaiTranscribe(audioFile.buffer);
    
    res.json({
      success: true,
      text: "Transcription Whisper (à implémenter)",
      mode: 'whisper',
    });

  } catch (error) {
    logger.error('Error in transcribe endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la transcription',
    });
  }
});

// POST /api/dashboard/iasted/chat
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Messages array required',
      });
    }

    const userId = req.user?.id || 'anonymous';
    const userRole = req.user?.role || 'MINISTRE';
    const result = await chatWithIAsted(messages, userId, userRole);

    logger.info(`Chat request processed (mode: ${result.mode})`);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error in chat endpoint:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la communication avec iAsted',
    });
  }
});

// POST /api/dashboard/iasted/generate-report
router.post('/generate-report', async (req, res) => {
  try {
    const { reportType = 'Rapport mensuel' } = req.body;
    const userId = req.user?.id || 'anonymous';

    const result = await generateReport(reportType, userId);

    logger.info(`Report generated: ${reportType} (mode: ${result.mode})`);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la génération du rapport',
    });
  }
});

// POST /api/dashboard/iasted/generate-decree
router.post('/generate-decree', async (req, res) => {
  try {
    const { subject, context: userContext } = req.body;

    if (!subject) {
      return res.status(400).json({
        success: false,
        error: 'Subject required',
      });
    }

    const userId = req.user?.id || 'anonymous';
    
    const messages = [
      {
        role: 'user',
        content: `Rédige un projet de décret ministériel sur : "${subject}"\n\nContexte additionnel : ${userContext || 'Aucun'}`,
      },
    ];

    const result = await chatWithIAsted(messages, userId);

    logger.info(`Decree draft generated for: ${subject}`);
    res.json({ success: true, data: result });
  } catch (error) {
    logger.error('Error generating decree:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la génération du décret',
    });
  }
});

// GET /api/dashboard/iasted/status
router.get('/status', (req, res) => {
  const isConfigured = !!process.env.ANTHROPIC_API_KEY;
  
  res.json({
    success: true,
    data: {
      configured: isConfigured,
      mode: isConfigured ? 'anthropic' : 'fallback',
      model: process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022',
      message: isConfigured 
        ? 'iAsted opérationnel avec Anthropic Claude' 
        : 'iAsted en mode simulation (clé API manquante)',
    },
  });
});

export default router;

