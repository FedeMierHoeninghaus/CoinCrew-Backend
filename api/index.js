const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/app.module');
const { ValidationPipe } = require('@nestjs/common');

let app;

async function createApp() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    
    // Configurar CORS
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3001'];
    
    app.enableCors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
    
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true
    }));

    await app.init();
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    const app = await createApp();
    const expressApp = app.getHttpAdapter().getInstance();
    return expressApp(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};