import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { CompleteExerciseDto } from './dto/complete-exercise.dto';
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

  @Get('progress')
  @ApiOperation({
    summary: 'Get authenticated user training progress',
  })
  @ApiOkResponse({
    description: 'Training progress returned successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid token',
  })
  progress(@Req() request: AuthenticatedRequest) {
    return this.trainingService.getProgressForUser(request.user.id);
  }

  @Get('history/:planId')
  @ApiOperation({
    summary: 'Get a completed training plan detail',
  })
  @ApiOkResponse({
    description: 'Training plan detail returned successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid token',
  })
  historyDetail(
    @Req() request: AuthenticatedRequest,
    @Param('planId') planId: string,
  ) {
    return this.trainingService.getHistoryDetailForUser(
      request.user.id,
      planId,
    );
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get completed training plan history',
  })
  @ApiOkResponse({
    description: 'Training plan history returned successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid token',
  })
  history(@Req() request: AuthenticatedRequest) {
    return this.trainingService.getHistoryForUser(request.user.id);
  }

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

  @Patch('session/:id/start')
  @ApiOperation({
    summary: 'Start a training session',
  })
  @ApiOkResponse({
    description: 'Training session started successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid token',
  })
  startSession(
    @Req() request: AuthenticatedRequest,
    @Param('id') sessionId: string,
  ) {
    return this.trainingService.startSessionForUser(request.user.id, sessionId);
  }

  @Patch('exercise/:id/complete')
  @ApiOperation({
    summary: 'Complete a training exercise',
  })
  @ApiOkResponse({
    description: 'Training exercise completed successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid token',
  })
  completeExercise(
    @Req() request: AuthenticatedRequest,
    @Param('id') assignmentId: string,
    @Body() dto: CompleteExerciseDto,
  ) {
    return this.trainingService.completeExerciseForUser(
      request.user.id,
      assignmentId,
      dto,
    );
  }
}
