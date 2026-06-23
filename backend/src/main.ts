import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Use nestjs-pino logger
  app.useLogger(app.get(Logger));

  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable CORS for Next.js frontends
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}
void bootstrap();
