import type { exercises, profiles } from '../../../database/schema';

export type TrainingProfile = typeof profiles.$inferSelect;
export type ExerciseRecord = typeof exercises.$inferSelect;

export type SessionDifficulty = 'easy' | 'medium' | 'hard';

export interface SelectedExercise {
  exercise: ExerciseRecord;
  score: number;
  reason: string;
}

export interface TrainingSessionBlueprint {
  dayNumber: number;
  title: string;
  objective: string;
  durationMinutes: number;
  difficulty: SessionDifficulty;
  exercises: SelectedExercise[];
  safetyNotes: string[];
}

export interface TrainingPlanBlueprint {
  name: string;
  generationReason: string;
  sessions: TrainingSessionBlueprint[];
  metadata: {
    fitnessLevel: TrainingProfile['fitnessLevel'];
    role: TrainingProfile['role'];
    goals: TrainingProfile['goals'];
    availableMinutes: number;
  };
}
