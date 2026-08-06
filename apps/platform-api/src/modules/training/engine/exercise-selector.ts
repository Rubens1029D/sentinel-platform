import type {
  ExerciseRecord,
  SelectedExercise,
  TrainingProfile,
} from '../types/training-engine.types';

type ActualInjury = Exclude<TrainingProfile['injuries'][number], 'none'>;

const difficultyScore: Record<
  TrainingProfile['fitnessLevel'],
  ExerciseRecord['difficulty'][]
> = {
  'very-low': ['beginner'],
  low: ['beginner'],
  medium: ['beginner', 'intermediate'],
  good: ['beginner', 'intermediate', 'advanced'],
  excellent: ['intermediate', 'advanced'],
};

function isActualInjury(
  injury: TrainingProfile['injuries'][number],
): injury is ActualInjury {
  return injury !== 'none';
}

function hasExcludedInjury(
  exercise: ExerciseRecord,
  profile: TrainingProfile,
): boolean {
  const actualInjuries = profile.injuries.filter(isActualInjury);

  return exercise.excludedForInjuries
    .filter(isActualInjury)
    .some((injury) => actualInjuries.includes(injury));
}

function hasRequiredEquipment(
  exercise: ExerciseRecord,
  profile: TrainingProfile,
): boolean {
  return exercise.requiredEquipment.every((equipment) =>
    profile.equipment.includes(equipment),
  );
}

function calculateGoalScore(
  exercise: ExerciseRecord,
  profile: TrainingProfile,
): number {
  let score = 0;

  if (
    profile.goals.includes('weight-loss') &&
    ['cardio', 'endurance'].includes(exercise.category)
  ) {
    score += 4;
  }

  if (
    profile.goals.includes('endurance') &&
    ['cardio', 'endurance'].includes(exercise.category)
  ) {
    score += 4;
  }

  if (
    profile.goals.includes('operational-readiness') &&
    exercise.isOperational
  ) {
    score += 5;
  }

  if (
    profile.goals.includes('initial-training') &&
    exercise.difficulty === 'beginner'
  ) {
    score += 3;
  }

  if (
    profile.goals.includes('competition') &&
    ['power', 'endurance'].includes(exercise.category)
  ) {
    score += 3;
  }

  return score;
}

export function selectCompatibleExercises(
  exercises: ExerciseRecord[],
  profile: TrainingProfile,
): SelectedExercise[] {
  const allowedDifficulties = difficultyScore[profile.fitnessLevel];

  return exercises
    .filter((exercise) => exercise.isActive)
    .filter((exercise) => allowedDifficulties.includes(exercise.difficulty))
    .filter((exercise) => !hasExcludedInjury(exercise, profile))
    .filter((exercise) => hasRequiredEquipment(exercise, profile))
    .map((exercise) => {
      let score = calculateGoalScore(exercise, profile);

      if (exercise.isOperational) {
        score += 2;
      }

      if (exercise.impact === 'low') {
        score += 1;
      }

      return {
        exercise,
        score,
        reason:
          score >= 6
            ? 'Alta compatibilidad con el perfil y los objetivos.'
            : 'Ejercicio compatible con las restricciones del usuario.',
      };
    })
    .sort((first, second) => second.score - first.score);
}
