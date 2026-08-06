import { sql } from 'drizzle-orm';
import {
  boolean,
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
import { equipmentEnum, injuryAreaEnum } from './profiles.schema';

export const exerciseCategoryEnum = pgEnum('exercise_category', [
  'strength',
  'cardio',
  'mobility',
  'endurance',
  'power',
  'operational',
  'recovery',
]);

export const exerciseDifficultyEnum = pgEnum('exercise_difficulty', [
  'beginner',
  'intermediate',
  'advanced',
]);

export const exerciseImpactEnum = pgEnum('exercise_impact', [
  'low',
  'medium',
  'high',
]);

export const exercises = pgTable(
  'exercises',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    slug: varchar('slug', {
      length: 120,
    }).notNull(),

    name: varchar('name', {
      length: 160,
    }).notNull(),

    description: text('description').notNull(),

    category: exerciseCategoryEnum('category').notNull(),

    difficulty: exerciseDifficultyEnum('difficulty').notNull(),

    impact: exerciseImpactEnum('impact').notNull(),

    defaultDurationSeconds: integer('default_duration_seconds'),

    defaultRepetitions: integer('default_repetitions'),

    defaultSets: integer('default_sets').notNull().default(1),

    restSeconds: integer('rest_seconds').notNull().default(30),

    requiredEquipment: equipmentEnum('required_equipment')
      .array()
      .notNull()
      .default(sql`ARRAY[]::equipment[]`),

    excludedForInjuries: injuryAreaEnum('excluded_for_injuries')
      .array()
      .notNull()
      .default(sql`ARRAY[]::injury_area[]`),

    instructions: jsonb('instructions')
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),

    safetyNotes: jsonb('safety_notes')
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),

    isOperational: boolean('is_operational').notNull().default(false),

    isActive: boolean('is_active').notNull().default(true),

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
  (table) => [uniqueIndex('exercises_slug_unique').on(table.slug)],
);
