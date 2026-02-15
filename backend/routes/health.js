const express = require('express');
const router = express.Router();
const { getConnectionStatus } = require('../config/database');
const aiService = require('../services/aiService');

router.get('/', async (req, res) => {
  const health = {
    status: 'operational',
    timestamp: new Date().toISOString(),
    services: {}
  };

  // Check backend
  health.services.backend = {
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  };

  // Check database
  const dbStatus = getConnectionStatus();
  health.services.database = {
    status: dbStatus.isConnected ? 'healthy' : 'unhealthy',
    connection: dbStatus.status
  };

  // Check AI service
  let aiHealthy = false;
  try {
    aiHealthy = await aiService.checkConnection();
    health.services.ai = {
      status: aiHealthy ? 'healthy' : 'unhealthy',
      provider: 'Groq',
      model: 'Llama 3.3 70B Versatile'
    };
  } catch (error) {
    health.services.ai = {
      status: 'unhealthy',
      error: error.message,
      provider: 'Groq'
    };
  }

  // Determine overall status
  const allHealthy = dbStatus.isConnected && aiHealthy;
  health.status = allHealthy ? 'operational' : 'degraded';

  const statusCode = allHealthy ? 200 : 503;
  res.status(statusCode).json(health);
});

module.exports = router;