import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Habilitar compresión Gzip/Brotli para todas las respuestas REST
  app.use(compression());

  // Usar el registrador nestjs-pino
  app.useLogger(app.get(Logger));

  // Validación global con transformación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Interceptor global de respuestas uniformes
  app.useGlobalInterceptors(new TransformInterceptor());

  // Filtro global de excepciones
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Habilitar CORS para los frontends de Next.js
  app.enableCors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
void bootstrap();
