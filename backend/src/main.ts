import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Headers de seguridad HTTP (CSP, X-Frame-Options, HSTS, etc.)
  app.use(helmet());

  // Habilitar compresión Gzip/Brotli para todas las respuestas REST
  app.use(compression());

  // Usar el registrador nestjs-pino
  app.useLogger(app.get(Logger));

  // Validación global con transformación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // Rechaza la petición si hay propiedades extra
      transform: true,
    }),
  );

  // Interceptor global de respuestas uniformes
  app.useGlobalInterceptors(new TransformInterceptor());

  // Filtro global de excepciones
  app.useGlobalFilters(new GlobalExceptionFilter());

  // CORS: lista blanca explícita de orígenes autorizados
  // Fallback: en desarrollo local permite localhost. Nunca origin: true en producción.
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : [
        'https://jorgedoicela.com',
        'https://portfolio.jorgedoicela.com',
        'https://bible.jorgedoicela.com',
        'https://software.jorgedoicela.com',
        // En desarrollo local se añaden los puertos del monorepo
        ...(process.env.NODE_ENV !== 'production'
          ? [
              'http://localhost:3001',
              'http://localhost:3000',
              'http://localhost:3002',
            ]
          : []),
      ];
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
void bootstrap();
