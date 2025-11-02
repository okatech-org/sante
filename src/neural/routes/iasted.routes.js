import express from 'express';
import { chatWithIAsted, generateReport } from '../services/iasted.service.js';
import Logger from '../core/Logger.js';

const router = express.Router();
const logger = new Logger('iAstedRoutes');

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

