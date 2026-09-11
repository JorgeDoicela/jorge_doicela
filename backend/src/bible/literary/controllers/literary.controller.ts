import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { LiteraryService } from '../services/literary.service';

@Controller('bible/literary')
export class LiteraryController {
  constructor(private readonly literaryService: LiteraryService) {}

  @Get('chiasms')
  async getChiasms(@Query('lang') lang?: string, @Query('book') book?: string) {
    return this.literaryService.getChiasms(lang, book);
  }

  @Get('chiasms/:id')
  async getChiasmById(@Param('id') id: string, @Query('lang') lang?: string) {
    const chiasm = await this.literaryService.getChiasmById(id, lang);
    if (!chiasm) {
      throw new NotFoundException(`Estructura quiástica "${id}" no encontrada`);
    }
    return chiasm;
  }

  @Get('pauline')
  async getPaulineDiscourses(
    @Query('lang') lang?: string,
    @Query('epistle') epistle?: string,
  ) {
    return this.literaryService.getPaulineDiscourses(lang, epistle);
  }

  @Get('pauline/:id')
  async getPaulineDiscourseById(
    @Param('id') id: string,
    @Query('lang') lang?: string,
  ) {
    const discourse = await this.literaryService.getPaulineDiscourseById(
      id,
      lang,
    );
    if (!discourse) {
      throw new NotFoundException(`Discurso paulino "${id}" no encontrado`);
    }
    return discourse;
  }
}
