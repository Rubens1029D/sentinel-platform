import { Inject, Injectable } from '@nestjs/common';
import { and, asc, desc, eq } from 'drizzle-orm';
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

  async findSessionForUser(sessionId: string, userId: string) {
    const [result] = await this.db
      .select({
        session: trainingSessions,
        plan: trainingPlans,
      })
      .from(trainingSessions)
      .innerJoin(
        trainingPlans,
        eq(trainingSessions.trainingPlanId, trainingPlans.id),
      )
      .where(
        and(
          eq(trainingSessions.id, sessionId),
          eq(trainingPlans.userId, userId),
        ),
      )
      .limit(1);

    return result;
  }

  async startSession(sessionId: string) {
    const [session] = await this.db
      .update(trainingSessions)
      .set({
        status: 'in-progress',
        startedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(trainingSessions.id, sessionId))
      .returning();

    return session;
  }

  async findExerciseAssignment(assignmentId: string, userId: string) {
    const [result] = await this.db
      .select({
        assignment: trainingSessionExercises,
        session: trainingSessions,
        plan: trainingPlans,
      })
      .from(trainingSessionExercises)
      .innerJoin(
        trainingSessions,
        eq(trainingSessionExercises.trainingSessionId, trainingSessions.id),
      )
      .innerJoin(
        trainingPlans,
        eq(trainingSessions.trainingPlanId, trainingPlans.id),
      )
      .where(
        and(
          eq(trainingSessionExercises.id, assignmentId),
          eq(trainingPlans.userId, userId),
        ),
      )
      .limit(1);

    return result;
  }

  async completeExercise(
    assignmentId: string,
    data: {
      actualRepetitions?: number;
      actualDurationSeconds?: number;
    },
  ) {
    const [exercise] = await this.db
      .update(trainingSessionExercises)
      .set({
        completed: true,
        completedAt: new Date(),
        actualRepetitions: data.actualRepetitions,
        actualDurationSeconds: data.actualDurationSeconds,
      })
      .where(eq(trainingSessionExercises.id, assignmentId))
      .returning();

    return exercise;
  }

  async listSessionExercises(sessionId: string) {
    return this.db.query.trainingSessionExercises.findMany({
      where: eq(trainingSessionExercises.trainingSessionId, sessionId),
    });
  }

  async completeSession(sessionId: string) {
    const [session] = await this.db
      .update(trainingSessions)
      .set({
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(trainingSessions.id, sessionId))
      .returning();

    return session;
  }

  async listPlanSessions(planId: string) {
    return this.db.query.trainingSessions.findMany({
      where: eq(trainingSessions.trainingPlanId, planId),
    });
  }

  async completePlan(planId: string) {
    const [plan] = await this.db
      .update(trainingPlans)
      .set({
        status: 'completed',
        updatedAt: new Date(),
      })
      .where(eq(trainingPlans.id, planId))
      .returning();

    return plan;
  }

  findPlanHistoryByUserId(userId: string) {
    return this.db
      .select()
      .from(trainingPlans)
      .where(
        and(
          eq(trainingPlans.userId, userId),
          eq(trainingPlans.status, 'completed'),
        ),
      )
      .orderBy(desc(trainingPlans.endDate));
  }

  async findPlanByIdForUser(planId: string, userId: string) {
    const [plan] = await this.db
      .select()
      .from(trainingPlans)
      .where(
        and(eq(trainingPlans.id, planId), eq(trainingPlans.userId, userId)),
      )
      .limit(1);

    return plan;
  }

  async findAllPlansByUserId(userId: string) {
    return this.db
      .select()
      .from(trainingPlans)
      .where(eq(trainingPlans.userId, userId));
  }

  async findSessionsForUser(userId: string) {
    return this.db
      .select({
        session: trainingSessions,
      })
      .from(trainingSessions)
      .innerJoin(
        trainingPlans,
        eq(trainingSessions.trainingPlanId, trainingPlans.id),
      )
      .where(eq(trainingPlans.userId, userId));
  }

  async findExerciseAssignmentsForUser(userId: string) {
    return this.db
      .select({
        assignment: trainingSessionExercises,
      })
      .from(trainingSessionExercises)
      .innerJoin(
        trainingSessions,
        eq(trainingSessionExercises.trainingSessionId, trainingSessions.id),
      )
      .innerJoin(
        trainingPlans,
        eq(trainingSessions.trainingPlanId, trainingPlans.id),
      )
      .where(eq(trainingPlans.userId, userId));
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
