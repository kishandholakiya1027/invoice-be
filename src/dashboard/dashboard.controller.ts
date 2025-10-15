import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from '../dto/dashboard.dto';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Get dashboard overview',
    description:
      'Returns comprehensive dashboard data including statistics, recent invoices, and monthly trends',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: DashboardResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDashboard(@Request() req): Promise<DashboardResponseDto> {
    return this.dashboardService.getDashboardData(req.user.id);
  }
}
