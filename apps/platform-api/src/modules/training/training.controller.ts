import { Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  TrainingService,
  type CurrentTrainingPlan,
  type GeneratedTrainingPlan,
} from './training.service';
import type { TrainingPlanBlueprint } from './types/training-engine.types';

@ApiTags('Training')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get('current')
  @ApiOperation({
    summary: 'Get the authenticated user active training plan',
  })
  @ApiOkResponse({
    description: 'Active training plan returned successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid token',
  })
  current(@Req() request: AuthenticatedRequest): Promise<CurrentTrainingPlan> {
    return this.trainingService.getCurrentForUser(request.user.id);
  }

  @Post('preview')
  @ApiOperation({
    summary: 'Preview a personalized training plan',
  })
  @ApiOkResponse({
    description: 'Training preview generated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid token',
  })
  preview(
    @Req() request: AuthenticatedRequest,
  ): Promise<TrainingPlanBlueprint> {
    return this.trainingService.previewForUser(request.user.id);
  }

  @Post('generate')
  @ApiOperation({
    summary: 'Generate and persist a personalized training plan',
  })
  @ApiCreatedResponse({
    description: 'Training plan generated and saved successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid token',
  })
  generate(
    @Req() request: AuthenticatedRequest,
  ): Promise<GeneratedTrainingPlan> {
    return this.trainingService.generateForUser(request.user.id);
  }
}
