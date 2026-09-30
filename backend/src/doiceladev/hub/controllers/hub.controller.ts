import { Controller, Get, Query } from '@nestjs/common';
import { HubService } from '../services/hub.service';
import { HubResponseDto } from '../dto/hub-response.dto';
import { GetHubQueryDto } from '../dto/get-hub-query.dto';

@Controller('doiceladev/hub')
export class HubController {
  constructor(private readonly hubService: HubService) {}

  @Get()
  async getHub(@Query() query: GetHubQueryDto): Promise<HubResponseDto> {
    return this.hubService.getHubData(query.lang || 'es', query.search);
  }
}
