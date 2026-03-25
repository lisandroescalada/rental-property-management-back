import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure prefigure global /api prefix for all routes
  app.setGlobalPrefix('api');

  // Configure CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  // Configure ValidationPipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Rental Property Management API')
    .setDescription('API backend para gestión de propiedades en alquiler')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'jwt',
    )
    .addTag('Health')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Port and environment configuration
  const port = process.env.PORT || 3000;
  const nodeEnv = process.env.NODE_ENV || 'development';

  await app.listen(port);

  console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║   Rental Property Management Backend - Iniciado           ║
    ╠═══════════════════════════════════════════════════════════╣
    ║ Ambiente:     ${nodeEnv.toUpperCase().padEnd(39)}║
    ║ Puerto:       ${port.toString().padEnd(39)}║
    ║ URL Base:     http://localhost:${port}${' '.repeat(Math.max(0, 35 - port.toString().length))}║
    ║ Swagger:      http://localhost:${port}/api/docs${' '.repeat(Math.max(0, 28 - port.toString().length))}║
    ╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la aplicación:', err);
  process.exit(1);
});

