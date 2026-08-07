import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../../database/database.constants';
import type { SentinelDatabase } from '../../../database/database.types';
import {
  notificationEvents,
  notificationPreferences,
} from '../../../database/schema';

@Injectable()
export class NotificationsRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: SentinelDatabase,
  ) {}

  async findByUserId(userId: string) {
    const [preferences] = await this.db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
      .limit(1);

    return preferences;
  }

  async createDefaults(userId: string) {
    const [preferences] = await this.db
      .insert(notificationPreferences)
      .values({
        userId,
      })
      .returning();

    return preferences;
  }

  async updateByUserId(
    userId: string,
    data: {
      enabled?: boolean;
      trainingReminders?: boolean;
      streakReminders?: boolean;
      reminderHour?: number;
      timezone?: string;
    },
  ) {
    const [preferences] = await this.db
      .update(notificationPreferences)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(notificationPreferences.userId, userId))
      .returning();

    return preferences;
  }
  async findEvent(
    userId: string,
    type: string,
    referenceId: string,
    notificationDate: string,
  ) {
    const [event] = await this.db
      .select()
      .from(notificationEvents)
      .where(
        and(
          eq(notificationEvents.userId, userId),
          eq(notificationEvents.type, type),
          eq(notificationEvents.referenceId, referenceId),
          eq(notificationEvents.notificationDate, notificationDate),
        ),
      )
      .limit(1);

    return event;
  }

  async createEvent(data: {
    userId: string;
    type: string;
    referenceId: string;
    notificationDate: string;
  }) {
    const [event] = await this.db
      .insert(notificationEvents)
      .values({
        userId: data.userId,
        type: data.type,
        referenceId: data.referenceId,
        notificationDate: data.notificationDate,
        status: 'pending',
      })
      .returning();

    return event;
  }
}
