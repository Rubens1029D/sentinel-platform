import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('pending')
  @ApiOperation({
    summary: 'Get pending notifications',
  })
  @ApiOkResponse({
    description: 'Pending notifications returned successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid token',
  })
  pending(@Req() request: AuthenticatedRequest) {
    return this.notificationsService.getPendingNotificationsForUser(
      request.user.id,
    );
  }

  @Get('preferences')
  @ApiOperation({
    summary: 'Get notification preferences',
  })
  @ApiOkResponse({
    description: 'Notification preferences returned successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid token',
  })
  preferences(@Req() request: AuthenticatedRequest) {
    return this.notificationsService.getPreferencesForUser(request.user.id);
  }

  @Patch('preferences')
  @ApiOperation({
    summary: 'Update notification preferences',
  })
  @ApiOkResponse({
    description: 'Notification preferences updated successfully',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid token',
  })
  updatePreferences(
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    return this.notificationsService.updatePreferencesForUser(
      request.user.id,
      dto,
    );
  }
}
