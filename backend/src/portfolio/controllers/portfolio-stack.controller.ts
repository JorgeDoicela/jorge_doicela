import { Controller, Get, Query } from '@nestjs/common';
import { PortfolioStackService } from '../services/portfolio-stack.service';
import {
  PortfolioStackItem,
  StackCategoryType,
} from '../entities/portfolio-stack-item.entity';

const VALID_CATEGORIES: readonly StackCategoryType[] = [
  'frontend',
  'backend',
  'data_devops',
  'ai_security',
  'tools',
];

@Controller('portfolio/stack')
export class PortfolioStackController {
  constructor(private readonly stackService: PortfolioStackService) {}

  @Get()
  async getAllStack(
    @Query('lang') lang?: string,
    @Query('featured') featured?: string,
    @Query('category') category?: string,
  ): Promise<PortfolioStackItem[]> {
    const parsedFeatured =
      featured === 'true' ? true : featured === 'false' ? false : undefined;
    const parsedCategory = VALID_CATEGORIES.includes(
      category as StackCategoryType,
    )
      ? (category as StackCategoryType)
      : undefined;

    return this.stackService.findAll({
      language: lang,
      featured: parsedFeatured,
      category: parsedCategory,
    });
  }
}
