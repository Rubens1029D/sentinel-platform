import { selectCompatibleExercises } from './exercise-selector';
import type {
  ExerciseRecord,
  SessionDifficulty,
  TrainingPlanBlueprint,
  TrainingProfile,
} from '../types/training-engine.types';

function resolveDifficulty(
  fitnessLevel: TrainingProfile['fitnessLevel'],
): SessionDifficulty {
  if (fitnessLevel === 'very-low' || fitnessLevel === 'low') {
    return 'easy';
  }

  if (fitnessLevel === 'excellent') {
    return 'hard';
  }

  return 'medium';
}

function resolveSafetyNotes(profile: TrainingProfile): string[] {
  const injuries = profile.injuries.filter((injury) => injury !== 'none');

  if (injuries.length === 0) {
    return [
      'Detén el entrenamiento ante dolor, mareo o dificultad respiratoria.',
    ];
  }

  return [
    `Se excluyeron ejercicios incompatibles con: ${injuries.join(', ')}.`,
    'Trabaja únicamente dentro de un rango sin dolor.',
  ];
}

export function generateTrainingPlan(
  profile: TrainingProfile,
  exerciseCatalog: ExerciseRecord[],
): TrainingPlanBlueprint {
  const compatibleExercises = selectCompatibleExercises(
    exerciseCatalog,
    profile,
  );

  if (compatibleExercises.length < 3) {
    throw new Error(
      'There are not enough compatible exercises to generate a plan',
    );
  }

  const durationMinutes = Math.min(Math.max(profile.availableMinutes, 20), 90);

  const difficulty = resolveDifficulty(profile.fitnessLevel);
  const safetyNotes = resolveSafetyNotes(profile);

  const firstSession = compatibleExercises.slice(0, 3);
  const secondSession = compatibleExercises.slice(3, 6);
  const thirdSession = compatibleExercises.slice(6, 9);

  return {
    name: 'Plan semanal Sentinel Fire',
    generationReason:
      'Plan generado con base en condición física, lesiones, equipo, tiempo disponible y objetivos.',
    sessions: [
      {
        dayNumber: 1,
        title: 'Preparación física operativa',
        objective: 'Desarar fuerza y capacidad funcional.',
        durationMinutes,
        difficulty,
        exercises: firstSession,
        safetyNotes,
      },
      {
        dayNumber: 3,
        title: 'Resistencia para emergencias',
        objective: 'Mejorar la tolerancia al esfuerzo sostenido.',
        durationMinutes,
        difficulty,
        exercises:
          secondSession.length >= 2
            ? secondSession
            : compatibleExercises.slice(0, 3),
        safetyNotes,
      },
      {
        dayNumber: 5,
        title: 'Capacidad operacional',
        objective: 'Integrar movimientos aplicables al servicio.',
        durationMinutes,
        difficulty,
        exercises:
          thirdSession.length >= 2
            ? thirdSession
            : compatibleExercises.slice(0, 3),
        safetyNotes,
      },
    ],
    metadata: {
      fitnessLevel: profile.fitnessLevel,
      role: profile.role,
      goals: profile.goals,
      availableMinutes: profile.availableMinutes,
    },
  };
}
