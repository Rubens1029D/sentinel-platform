import {
  boolean,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const notificationPreferences = pgTable(
  'notification_preferences',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    enabled: boolean('enabled').notNull().default(true),

    trainingReminders: boolean('training_reminders').notNull().default(true),

    streakReminders: boolean('streak_reminders').notNull().default(true),

    reminderHour: integer('reminder_hour').notNull().default(18),

    timezone: varchar('timezone', {
      length: 100,
    })
      .notNull()
      .default('UTC'),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('notification_preferences_user_unique').on(table.userId),
  ],
);
