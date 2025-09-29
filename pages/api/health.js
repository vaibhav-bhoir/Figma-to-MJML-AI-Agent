/**
 * API Route: Health Check
 * Provides system status and configuration information
 */

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    services: {
      figma: {
        configured: !!process.env.FIGMA_TOKEN,
        status: process.env.FIGMA_TOKEN ? 'ready' : 'not configured'
      },
      openai: {
        configured: !!process.env.OPENAI_API_KEY,
        status: process.env.OPENAI_API_KEY ? 'ready' : 'not configured',
        fallbackAvailable: true
      },
      litmus: {
        configured: !!(process.env.LITMUS_API_KEY && process.env.LITMUS_USERNAME),
        status: (process.env.LITMUS_API_KEY && process.env.LITMUS_USERNAME) ? 'ready' : 'not configured'
      },
      mjml: {
        configured: true,
        status: 'ready'
      }
    },
    features: {
      figmaConversion: !!process.env.FIGMA_TOKEN,
      aiGeneration: !!process.env.OPENAI_API_KEY,
      fallbackGeneration: true,
      imageConversion: true,
      litmusTesting: !!(process.env.LITMUS_API_KEY && process.env.LITMUS_USERNAME),
      mjmlCompilation: true
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    }
  };

  // Check if any critical services are missing
  const criticalServices = ['figma'];
  const missingCritical = criticalServices.filter(
    service => !health.services[service].configured
  );

  if (missingCritical.length > 0) {
    health.status = 'degraded';
    health.warnings = [`Critical services not configured: ${missingCritical.join(', ')}`];
  }

  // Add setup instructions for missing services
  const setupInstructions = [];
  
  if (!health.services.figma.configured) {
    setupInstructions.push({
      service: 'Figma',
      instruction: 'Add FIGMA_TOKEN to environment variables. Get token from https://www.figma.com/developers/api#access-tokens'
    });
  }
  
  if (!health.services.openai.configured) {
    setupInstructions.push({
      service: 'OpenAI',
      instruction: 'Add OPENAI_API_KEY to environment variables. Get key from https://platform.openai.com/api-keys',
      note: 'Fallback mode available without API key'
    });
  }
  
  if (!health.services.litmus.configured) {
    setupInstructions.push({
      service: 'Litmus',
      instruction: 'Add LITMUS_API_KEY and LITMUS_USERNAME to environment variables. Get credentials from https://litmus.com/api',
      note: 'Optional - for email client testing'
    });
  }
  
  if (setupInstructions.length > 0) {
    health.setup = setupInstructions;
  }

  const statusCode = health.status === 'healthy' ? 200 : 206;
  
  return res.status(statusCode).json(health);
}