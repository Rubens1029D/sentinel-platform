import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../../database/database.constants';
import type { SentinelDatabase } from '../../../database/database.types';
import {
  exercises,
  profiles,
  trainingPlans,
  trainingSessionExercises,
  trainingSessions,
} from '../../../database/schema';

@Injectable()
export class TrainingRepository {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: SentinelDatabase,
  ) {}

  async findProfileByUserId(userId: string) {
    const [profile] = await this.db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    return profile;
  }

  findActiveExercises() {
    return this.db.select().from(exercises).where(eq(exercises.isActive, true));
  }

  cancelActivePlans(userId: string) {
    return this.db
      .update(trainingPlans)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(trainingPlans.userId, userId),
          eq(trainingPlans.status, 'active'),
        ),
      );
  }

  async findCurrentPlan(userId: string) {
    const [plan] = await this.db
      .select()
      .from(trainingPlans)
      .where(
        and(
          eq(trainingPlans.userId, userId),
          eq(trainingPlans.status, 'active'),
        ),
      )
      .limit(1);

    return plan;
  }

  findSessionsByPlanId(trainingPlanId: string) {
    return this.db
      .select()
      .from(trainingSessions)
      .where(eq(trainingSessions.trainingPlanId, trainingPlanId))
      .orderBy(asc(trainingSessions.dayNumber));
  }

  findExercisesBySessionId(trainingSessionId: string) {
    return this.db
      .select({
        assignmentId: trainingSessionExercises.id,
        exerciseId: exercises.id,
        slug: exercises.slug,
        name: exercises.name,
        description: exercises.description,
        category: exercises.category,
        difficulty: exercises.difficulty,
        impact: exercises.impact,
        position: trainingSessionExercises.position,
        sets: trainingSessionExercises.sets,
        repetitions: trainingSessionExercises.repetitions,
        durationSeconds: trainingSessionExercises.durationSeconds,
        restSeconds: trainingSessionExercises.restSeconds,
        notes: trainingSessionExercises.notes,
        instructions: exercises.instructions,
        safetyNotes: exercises.safetyNotes,
        requiredEquipment: exercises.requiredEquipment,
      })
      .from(trainingSessionExercises)
      .innerJoin(
        exercises,
        eq(trainingSessionExercises.exerciseId, exercises.id),
      )
      .where(eq(trainingSessionExercises.trainingSessionId, trainingSessionId))
      .orderBy(asc(trainingSessionExercises.position));
  }

  transaction<T>(
    callback: Parameters<SentinelDatabase['transaction']>[0],
  ): Promise<T> {
    return this.db.transaction(callback) as Promise<T>;
  }

  get tables() {
    return {
      trainingPlans,
      trainingSessions,
      trainingSessionExercises,
    };
  }
}
