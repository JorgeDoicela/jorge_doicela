import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import * as os from 'os';
import {
  EngineeringDomainType,
  PortfolioEngineeringPillar,
} from '../entities/portfolio-engineering-pillar.entity';

export interface ServerTelemetrySnapshot {
  runtime: string;
  platform: string;
  arch: string;
  uptimeSeconds: number;
  memoryRssMb: number;
  heapUsedMb: number;
  status: 'operational';
  timestamp: string;
}

@Injectable()
export class PortfolioEngineeringService {
  constructor(
    @InjectRepository(PortfolioEngineeringPillar, 'portfolioConnection')
    private readonly engineeringRepository: Repository<PortfolioEngineeringPillar>,
  ) {}

  async findAll(options?: {
    language?: string;
    featured?: boolean;
    domain?: EngineeringDomainType;
  }): Promise<PortfolioEngineeringPillar[]> {
    const lang = options?.language === 'en' ? 'en' : 'es';
    const buildWhere = (
      targetLang: string,
    ): FindOptionsWhere<PortfolioEngineeringPillar> => {
      const where: FindOptionsWhere<PortfolioEngineeringPillar> = {
        language: targetLang,
      };
      if (options?.featured !== undefined) {
        where.featured = options.featured;
      }
      if (options?.domain) {
        where.domain = options.domain;
      }
      return where;
    };

    let items = await this.engineeringRepository.find({
      where: buildWhere(lang),
      order: { orderIndex: 'ASC', id: 'ASC' },
    });

    if (items.length === 0 && lang !== 'es') {
      items = await this.engineeringRepository.find({
        where: buildWhere('es'),
        order: { orderIndex: 'ASC', id: 'ASC' },
      });
    }

    return items;
  }

  getTelemetry(): ServerTelemetrySnapshot {
    const mem = process.memoryUsage();
    return {
      runtime: `Node.js ${process.version}`,
      platform: os.platform(),
      arch: os.arch(),
      uptimeSeconds: Math.floor(process.uptime()),
      memoryRssMb: Math.round(mem.rss / (1024 * 1024)),
      heapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)),
      status: 'operational',
      timestamp: new Date().toISOString(),
    };
  }
}
