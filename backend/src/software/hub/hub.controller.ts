import { Controller, Get, Query } from '@nestjs/common';
import { HubService, HubResponseDto } from './hub.service';

@Controller('software/hub')
export class HubController {
  constructor(private readonly hubService: HubService) {}

  @Get()
  async getHub(
    @Query('lang') lang?: string,
    @Query('search') search?: string,
  ): Promise<HubResponseDto> {
    return this.hubService.getHubData(lang || 'es', search);
  }
}
