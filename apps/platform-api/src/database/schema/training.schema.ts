import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { exercises } from './exercises.schema';
import { users } from './users.schema';

export const trainingPlanStatusEnum = pgEnum('training_plan_status', [
  'active',
  'completed',
  'cancelled',
]);

export const trainingSessionStatusEnum = pgEnum('training_session_status', [
  'scheduled',
  'in-progress',
  'completed',
  'skipped',
]);

export const trainingSessionDifficultyEnum = pgEnum(
  'training_session_difficulty',
  ['easy', 'medium', 'hard'],
);

export const trainingPlans = pgTable('training_plans', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),

  name: varchar('name', {
    length: 160,
  }).notNull(),

  status: trainingPlanStatusEnum('status').notNull().default('active'),

  startDate: date('start_date').notNull(),

  endDate: date('end_date').notNull(),

  generationReason: text('generation_reason').notNull(),

  metadata: jsonb('metadata')
    .$type<Record<string, unknown>>()
    .notNull()
    .default({}),

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

export const trainingSessions = pgTable(
  'training_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    trainingPlanId: uuid('training_plan_id')
      .notNull()
      .references(() => trainingPlans.id, {
        onDelete: 'cascade',
      }),

    dayNumber: integer('day_number').notNull(),

    scheduledDate: date('scheduled_date').notNull(),

    title: varchar('title', {
      length: 160,
    }).notNull(),

    objective: text('objective').notNull(),

    durationMinutes: integer('duration_minutes').notNull(),

    difficulty: trainingSessionDifficultyEnum('difficulty').notNull(),

    status: trainingSessionStatusEnum('status').notNull().default('scheduled'),

    safetyNotes: jsonb('safety_notes').$type<string[]>().notNull().default([]),

    startedAt: timestamp('started_at', {
      withTimezone: true,
    }),

    completedAt: timestamp('completed_at', {
      withTimezone: true,
    }),

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
    uniqueIndex('training_sessions_plan_day_unique').on(
      table.trainingPlanId,
      table.dayNumber,
    ),
  ],
);

export const trainingSessionExercises = pgTable(
  'training_session_exercises',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    trainingSessionId: uuid('training_session_id')
      .notNull()
      .references(() => trainingSessions.id, {
        onDelete: 'cascade',
      }),

    exerciseId: uuid('exercise_id')
      .notNull()
      .references(() => exercises.id, {
        onDelete: 'restrict',
      }),

    position: integer('position').notNull(),

    sets: integer('sets').notNull(),

    repetitions: integer('repetitions'),

    durationSeconds: integer('duration_seconds'),

    restSeconds: integer('rest_seconds').notNull(),

    notes: text('notes'),

    completed: boolean('completed').notNull().default(false),

    completedAt: timestamp('completed_at', {
      withTimezone: true,
    }),

    actualRepetitions: integer('actual_repetitions'),

    actualDurationSeconds: integer('actual_duration_seconds'),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('training_session_exercise_position_unique').on(
      table.trainingSessionId,
      table.position,
    ),
  ],
);
