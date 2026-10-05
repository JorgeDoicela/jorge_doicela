import { Controller, Get, Query } from '@nestjs/common';
import { PortalService } from '../services/portal.service';
import { PortalResponseDto } from '../dto/portal-response.dto';
import { GetPortalQueryDto } from '../dto/get-portal-query.dto';

@Controller('doiceladev/portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Get()
  async getPortal(
    @Query() query: GetPortalQueryDto,
  ): Promise<PortalResponseDto> {
    return this.portalService.getPortalData(query.lang || 'es', query.search);
  }
}
