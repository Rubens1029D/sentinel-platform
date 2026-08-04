import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompleteProfileDto } from './dto/complete-profile.dto';
import { ProfileService, type ProfileRecord } from './profile.service';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('complete')
  @ApiOperation({
    summary: 'Complete or update the authenticated user profile',
  })
  @ApiCreatedResponse({ description: 'Profile saved successfully' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  complete(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CompleteProfileDto,
  ): Promise<ProfileRecord> {
    return this.profileService.complete(request.user.id, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiOkResponse({ description: 'Profile returned successfully' })
  @ApiNotFoundResponse({ description: 'Profile has not been completed' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  me(@Req() request: AuthenticatedRequest): Promise<ProfileRecord> {
    return this.profileService.findByUserId(request.user.id);
  }
}
