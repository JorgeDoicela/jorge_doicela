import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { PortfolioLabChallenge } from '../entities/portfolio-lab-challenge.entity';

export interface VerifyFlagResult {
  slug: string;
  valid: boolean;
  pointsAwarded: number;
}

@Injectable()
export class PortfolioLabsService {
  constructor(
    @InjectRepository(PortfolioLabChallenge, 'portfolioConnection')
    private readonly labRepository: Repository<PortfolioLabChallenge>,
  ) {}

  async findAll(language?: string): Promise<PortfolioLabChallenge[]> {
    const lang = language === 'en' ? 'en' : 'es';
    let items = await this.labRepository.find({
      where: { language: lang, active: true },
      order: { orderIndex: 'ASC', id: 'ASC' },
    });

    if (items.length === 0 && lang !== 'es') {
      items = await this.labRepository.find({
        where: { language: 'es', active: true },
        order: { orderIndex: 'ASC', id: 'ASC' },
      });
    }

    return items;
  }

  async verifyFlag(
    slug: string,
    submittedFlag: string,
  ): Promise<VerifyFlagResult> {
    const challenge = await this.labRepository
      .createQueryBuilder('lab')
      .addSelect('lab.flagHash')
      .where('lab.slug = :slug', { slug })
      .andWhere('lab.active = :active', { active: true })
      .getOne();

    if (!challenge || !challenge.flagHash) {
      throw new NotFoundException(`Reto "${slug}" no encontrado.`);
    }

    const normalized = submittedFlag.trim();
    const submittedHash = crypto
      .createHash('sha256')
      .update(normalized, 'utf8')
      .digest('hex');

    const expectedBuf = Buffer.from(challenge.flagHash, 'utf8');
    const submittedBuf = Buffer.from(submittedHash, 'utf8');

    const isValid =
      expectedBuf.length === submittedBuf.length &&
      crypto.timingSafeEqual(expectedBuf, submittedBuf);

    return {
      slug: challenge.slug,
      valid: isValid,
      pointsAwarded: isValid ? challenge.points : 0,
    };
  }
}
