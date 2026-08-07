import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({
    summary: 'Get authenticated user dashboard',
  })
  @ApiOkResponse({
    description: 'Dashboard returned successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid token',
  })
  dashboard(@Req() request: AuthenticatedRequest) {
    return this.dashboardService.getDashboardForUser(request.user.id);
  }
}
