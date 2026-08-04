import {
  boolean,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const userStatusEnum = pgEnum('user_status', [
  'pending',
  'active',
  'suspended',
]);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  email: varchar('email', { length: 254 }).notNull().unique(),

  passwordHash: varchar('password_hash', { length: 255 }).notNull(),

  status: userStatusEnum('status').notNull().default('pending'),

  emailVerified: boolean('email_verified').notNull().default(false),

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
});
