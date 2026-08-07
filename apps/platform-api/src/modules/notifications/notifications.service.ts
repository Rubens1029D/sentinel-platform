import { Injectable } from '@nestjs/common';
import { TrainingService } from '../training/training.service';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';
import { NotificationsRepository } from './repositories/notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly trainingService: TrainingService,
  ) {}

  async getPreferencesForUser(userId: string) {
    const existing = await this.notificationsRepository.findByUserId(userId);

    if (existing) {
      return existing;
    }

    return this.notificationsRepository.createDefaults(userId);
  }

  async updatePreferencesForUser(
    userId: string,
    dto: UpdateNotificationPreferencesDto,
  ) {
    const existing = await this.notificationsRepository.findByUserId(userId);

    if (!existing) {
      await this.notificationsRepository.createDefaults(userId);
    }

    return this.notificationsRepository.updateByUserId(userId, dto);
  }

  async getPendingNotificationsForUser(userId: string) {
    const preferences = await this.getPreferencesForUser(userId);

    /*
     * Si las notificaciones están deshabilitadas,
     * no necesitamos hacer ningún cálculo adicional.
     */
    if (!preferences.enabled) {
      return [];
    }

    /*
     * Obtenemos la hora local usando la zona horaria
     * configurada por el usuario.
     */
    const localHour = this.getLocalHour(preferences.timezone);

    /*
     * No generar recordatorios antes de la hora
     * configurada por el usuario.
     */
    if (localHour < preferences.reminderHour) {
      return [];
    }

    /*
     * Es importante usar la fecha local del usuario
     * y no la fecha UTC del servidor.
     */
    const today = this.getLocalDate(preferences.timezone);

    const notifications: Array<{
      type: 'training-reminder' | 'streak-reminder';
      title: string;
      message: string;
    }> = [];

    /*
     * Obtener entrenamiento activo.
     *
     * getCurrentForUser puede lanzar NotFoundException
     * cuando no existe un plan activo.
     */
    let currentTraining = null;

    try {
      currentTraining = await this.trainingService.getCurrentForUser(userId);
    } catch {
      currentTraining = null;
    }

    /*
     * =====================================================
     * TRAINING REMINDER
     * =====================================================
     */
    if (preferences.trainingReminders && currentTraining) {
      const todaySession = currentTraining.sessions.find(
        (session) =>
          session.scheduledDate === today && session.status !== 'completed',
      );

      if (todaySession) {
        /*
         * Verificamos si ya generamos esta notificación
         * para esta sesión durante el día actual.
         */
        const existingEvent = await this.notificationsRepository.findEvent(
          userId,
          'training-reminder',
          todaySession.id,
          today,
        );

        if (!existingEvent) {
          /*
           * Registramos primero el evento para evitar
           * que vuelva a aparecer en llamadas posteriores.
           */
          await this.notificationsRepository.createEvent({
            userId,
            type: 'training-reminder',
            referenceId: todaySession.id,
            notificationDate: today,
          });

          notifications.push({
            type: 'training-reminder',
            title: 'Entrenamiento pendiente',
            message: `Hoy tienes pendiente: ${todaySession.title}.`,
          });
        }
      }
    }

    /*
     * =====================================================
     * STREAK REMINDER
     * =====================================================
     */
    if (preferences.streakReminders) {
      const progress = await this.trainingService.getProgressForUser(userId);

      if (progress.currentStreak > 0) {
        /*
         * La racha no tiene una sesión específica como
         * referencia, por lo que usamos una referencia
         * lógica estable.
         */
        const existingEvent = await this.notificationsRepository.findEvent(
          userId,
          'streak-reminder',
          'current-streak',
          today,
        );

        if (!existingEvent) {
          await this.notificationsRepository.createEvent({
            userId,
            type: 'streak-reminder',
            referenceId: 'current-streak',
            notificationDate: today,
          });

          notifications.push({
            type: 'streak-reminder',
            title: 'Mantén tu racha',
            message: `Llevas ${progress.currentStreak} día(s) consecutivo(s).`,
          });
        }
      }
    }

    return notifications;
  }

  private getLocalHour(timezone: string): number {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      hour12: false,
    });

    return Number(formatter.format(new Date()));
  }

  private getLocalDate(timezone: string): string {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    return formatter.format(new Date());
  }
}
