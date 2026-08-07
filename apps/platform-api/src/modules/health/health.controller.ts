import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthService } from './health.service';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Health')
@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Check API liveness',
  })
  @ApiOkResponse({
    description: 'API is running',
  })
  health() {
    return this.healthService.getHealth();
  }

  @Get('ready')
  @ApiOperation({
    summary: 'Check API readiness',
  })
  @ApiOkResponse({
    description: 'API is ready to receive traffic',
  })
  @ApiServiceUnavailableResponse({
    description: 'API dependency is unavailable',
  })
  readiness() {
    return this.healthService.getReadiness();
  }
}
