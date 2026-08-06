import { and, eq } from 'drizzle-orm';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  //exercises,
  trainingPlans,
  trainingSessionExercises,
  trainingSessions,
} from '../../database/schema';
import { generateTrainingPlan } from './engine/rule-training-engine';
import { TrainingRepository } from './repositories/training.repository';
import type {
  TrainingPlanBlueprint,
  TrainingSessionBlueprint,
} from './types/training-engine.types';

export interface GeneratedTrainingPlan {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  generationReason: string;
  sessions: Array<{
    id: string;
    dayNumber: number;
    scheduledDate: string;
    title: string;
    objective: string;
    durationMinutes: number;
    difficulty: 'easy' | 'medium' | 'hard';
    exercises: Array<{
      id: string;
      exerciseId: string;
      position: number;
      sets: number;
      repetitions: number | null;
      durationSeconds: number | null;
      restSeconds: number;
      notes: string | null;
    }>;
  }>;
}

export interface CurrentTrainingPlan {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  generationReason: string;
  metadata: Record<string, unknown>;
  sessions: Array<{
    id: string;
    dayNumber: number;
    scheduledDate: string;
    title: string;
    objective: string;
    durationMinutes: number;
    difficulty: 'easy' | 'medium' | 'hard';
    status: 'scheduled' | 'in-progress' | 'completed' | 'skipped';
    safetyNotes: string[];
    exercises: Array<{
      assignmentId: string;
      exerciseId: string;
      slug: string;
      name: string;
      description: string;
      category: string;
      difficulty: string;
      impact: string;
      position: number;
      sets: number;
      repetitions: number | null;
      durationSeconds: number | null;
      restSeconds: number;
      notes: string | null;
      instructions: string[];
      safetyNotes: string[];
      requiredEquipment: string[];
    }>;
  }>;
}

type TrainingTransaction = Parameters<
  Parameters<TrainingRepository['transaction']>[0]
>[0];

@Injectable()
export class TrainingService {
  constructor(private readonly trainingRepository: TrainingRepository) {}

  async previewForUser(userId: string): Promise<TrainingPlanBlueprint> {
    const { profile, exerciseCatalog } =
      await this.loadGenerationContext(userId);

    return generateTrainingPlan(profile, exerciseCatalog);
  }

  async generateForUser(userId: string): Promise<GeneratedTrainingPlan> {
    const { profile, exerciseCatalog } =
      await this.loadGenerationContext(userId);

    const blueprint = generateTrainingPlan(profile, exerciseCatalog);

    const startDate = this.toDateString(new Date());
    const endDate = this.toDateString(this.addDays(new Date(), 6));

    return this.trainingRepository.transaction<GeneratedTrainingPlan>(
      async (transaction) => {
        await transaction
          .update(trainingPlans)
          .set({
            status: 'cancelled',
            updatedAt: new Date(),
          })
          .where(this.buildActivePlanCondition(userId));

        const [plan] = await transaction
          .insert(trainingPlans)
          .values({
            userId,
            name: blueprint.name,
            status: 'active',
            startDate,
            endDate,
            generationReason: blueprint.generationReason,
            metadata: blueprint.metadata,
          })
          .returning();

        if (!plan) {
          throw new Error('Training plan could not be created');
        }

        const persistedSessions: GeneratedTrainingPlan['sessions'] = [];

        for (const sessionBlueprint of blueprint.sessions) {
          const persistedSession = await this.persistSession(
            transaction,
            plan.id,
            startDate,
            sessionBlueprint,
          );

          persistedSessions.push(persistedSession);
        }

        return {
          id: plan.id,
          name: plan.name,
          status: plan.status,
          startDate: plan.startDate,
          endDate: plan.endDate,
          generationReason: plan.generationReason,
          sessions: persistedSessions,
        };
      },
    );
  }

  async getCurrentForUser(userId: string): Promise<CurrentTrainingPlan> {
    const plan = await this.trainingRepository.findCurrentPlan(userId);

    if (!plan) {
      throw new NotFoundException(
        'The user does not have an active training plan',
      );
    }

    const sessions = await this.trainingRepository.findSessionsByPlanId(
      plan.id,
    );

    const sessionsWithExercises = await Promise.all(
      sessions.map(async (session) => {
        const sessionExercises =
          await this.trainingRepository.findExercisesBySessionId(session.id);

        return {
          id: session.id,
          dayNumber: session.dayNumber,
          scheduledDate: session.scheduledDate,
          title: session.title,
          objective: session.objective,
          durationMinutes: session.durationMinutes,
          difficulty: session.difficulty,
          status: session.status,
          safetyNotes: session.safetyNotes,
          exercises: sessionExercises,
        };
      }),
    );

    return {
      id: plan.id,
      name: plan.name,
      status: plan.status,
      startDate: plan.startDate,
      endDate: plan.endDate,
      generationReason: plan.generationReason,
      metadata: plan.metadata,
      sessions: sessionsWithExercises,
    };
  }

  private async loadGenerationContext(userId: string) {
    const profile = await this.trainingRepository.findProfileByUserId(userId);

    if (!profile) {
      throw new NotFoundException(
        'Complete the user profile before generating training',
      );
    }

    const exerciseCatalog = await this.trainingRepository.findActiveExercises();

    if (exerciseCatalog.length === 0) {
      throw new NotFoundException('The exercise catalog is empty');
    }

    return {
      profile,
      exerciseCatalog,
    };
  }

  private async persistSession(
    transaction: TrainingTransaction,
    trainingPlanId: string,
    startDate: string,
    blueprint: TrainingSessionBlueprint,
  ): Promise<GeneratedTrainingPlan['sessions'][number]> {
    const scheduledDate = this.toDateString(
      this.addDays(new Date(`${startDate}T00:00:00`), blueprint.dayNumber - 1),
    );

    const [session] = await transaction
      .insert(trainingSessions)
      .values({
        trainingPlanId,
        dayNumber: blueprint.dayNumber,
        scheduledDate,
        title: blueprint.title,
        objective: blueprint.objective,
        durationMinutes: blueprint.durationMinutes,
        difficulty: blueprint.difficulty,
        status: 'scheduled',
        safetyNotes: blueprint.safetyNotes,
      })
      .returning();

    if (!session) {
      throw new Error('Training session could not be created');
    }

    const sessionExercises = blueprint.exercises.map((selected, index) => ({
      trainingSessionId: session.id,
      exerciseId: selected.exercise.id,
      position: index + 1,
      sets: selected.exercise.defaultSets,
      repetitions: selected.exercise.defaultRepetitions ?? null,
      durationSeconds: selected.exercise.defaultDurationSeconds ?? null,
      restSeconds: selected.exercise.restSeconds,
      notes: selected.reason,
    }));

    const persistedExercises =
      sessionExercises.length > 0
        ? await transaction
            .insert(trainingSessionExercises)
            .values(sessionExercises)
            .returning()
        : [];

    return {
      id: session.id,
      dayNumber: session.dayNumber,
      scheduledDate: session.scheduledDate,
      title: session.title,
      objective: session.objective,
      durationMinutes: session.durationMinutes,
      difficulty: session.difficulty,
      exercises: persistedExercises.map((item) => ({
        id: item.id,
        exerciseId: item.exerciseId,
        position: item.position,
        sets: item.sets,
        repetitions: item.repetitions,
        durationSeconds: item.durationSeconds,
        restSeconds: item.restSeconds,
        notes: item.notes,
      })),
    };
  }

  private buildActivePlanCondition(userId: string) {
    return and(
      eq(trainingPlans.userId, userId),
      eq(trainingPlans.status, 'active'),
    );
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);

    return result;
  }

  private toDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
