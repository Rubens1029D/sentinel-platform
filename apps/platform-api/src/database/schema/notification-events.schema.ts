import {
  date,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const notificationEventStatusEnum = pgEnum('notification_event_status', [
  'pending',
  'sent',
  'failed',
]);

export const notificationEvents = pgTable(
  'notification_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    type: varchar('type', {
      length: 50,
    }).notNull(),

    referenceId: varchar('reference_id', {
      length: 100,
    }).notNull(),

    notificationDate: date('notification_date').notNull(),

    status: notificationEventStatusEnum('status').notNull().default('pending'),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

    sentAt: timestamp('sent_at', {
      withTimezone: true,
    }),
  },
  (table) => [
    uniqueIndex('notification_events_unique_daily').on(
      table.userId,
      table.type,
      table.referenceId,
      table.notificationDate,
    ),
  ],
);
