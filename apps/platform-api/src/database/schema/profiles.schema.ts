import { sql } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  real,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const biologicalSexEnum = pgEnum('biological_sex', [
  'male',
  'female',
  'other',
]);

export const operationalRoleEnum = pgEnum('operational_role', [
  'firefighter',
  'industrial-brigade',
  'civil-protection',
  'rescuer',
]);

export const fitnessLevelEnum = pgEnum('fitness_level', [
  'very-low',
  'low',
  'medium',
  'good',
  'excellent',
]);

export const injuryAreaEnum = pgEnum('injury_area', [
  'knee',
  'back',
  'shoulder',
  'ankle',
  'none',
]);

export const equipmentEnum = pgEnum('equipment', [
  'scba',
  'jacket',
  'helmet',
  'boots',
  'ladder',
  'hose',
]);

export const trainingGoalEnum = pgEnum('training_goal', [
  'weight-loss',
  'endurance',
  'initial-training',
  'operational-readiness',
  'promotion',
  'competition',
]);

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    age: integer('age').notNull(),

    sex: biologicalSexEnum('sex').notNull(),

    heightCm: integer('height_cm').notNull(),

    weightKg: real('weight_kg').notNull(),

    role: operationalRoleEnum('role').notNull(),

    experienceYears: integer('experience_years').notNull(),

    fitnessLevel: fitnessLevelEnum('fitness_level').notNull(),

    injuries: injuryAreaEnum('injuries')
      .array()
      .notNull()
      .default(sql`ARRAY[]::injury_area[]`),

    equipment: equipmentEnum('equipment')
      .array()
      .notNull()
      .default(sql`ARRAY[]::equipment[]`),

    availableMinutes: integer('available_minutes').notNull(),

    goals: trainingGoalEnum('goals')
      .array()
      .notNull()
      .default(sql`ARRAY[]::training_goal[]`),

    completedAt: timestamp('completed_at', {
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),

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
  (table) => [uniqueIndex('profiles_user_id_unique').on(table.userId)],
);
