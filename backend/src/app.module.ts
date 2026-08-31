import { Module } from '@nestjs/common';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * REGRA ARQUITECTÓNICA: Proyectos Independientes (Consolidación por Hardware)
 * ---------------------------------------------------------------------------
 * Este repositorio unifica la ejecución de tres proyectos totalmente distintos:
 * 1. Portfolio
 * 2. Bible
 * 3. Software
 *
 * Se ejecutan bajo un mismo proceso NestJS únicamente para optimizar recursos en producción
 * (servidores de 1GB RAM) y evitar levantar múltiples instancias Node.js.
 *
 * REGLAS STRICTAS:
 * 1. Son aplicaciones completamente separadas. NINGÚN módulo debe conocer, importar o interactuar
 *    con el código, entidades o lógica de los otros.
 * 2. NINGÚN módulo debe compartir bases de datos o servicios. Cada uno mantiene su propia persistencia.
 * 3. No existe comunicación (ni directa ni por eventos) entre ellos, ya que conceptualmente
 *    no tienen ninguna relación de negocio.
 * 4. La estructura física debe permitir copiar y pegar la carpeta de cualquier módulo (ej. /bible)
 *    a otro servidor NestJS limpio y que funcione de manera autónoma de inmediato.
 */
import { PortfolioModule } from './portfolio/portfolio.module';
import { BibleModule } from './bible/bible.module';
import { SoftwareModule } from './software/software.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(process.cwd(), '.env'),
        path.resolve(process.cwd(), 'backend/.env'),
        path.resolve(__dirname, '../.env'),
      ],
    }),
    EventEmitterModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                },
              }
            : undefined,
      },
    }),
    PortfolioModule,
    BibleModule,
    SoftwareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
