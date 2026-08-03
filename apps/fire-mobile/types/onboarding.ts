export type BiologicalSex = 'male' | 'female' | 'other';

export type OperationalRole =
  | 'firefighter'
  | 'industrial-brigade'
  | 'civil-protection'
  | 'rescuer';

export type FitnessLevel =
  | 'very-low'
  | 'low'
  | 'medium'
  | 'good'
  | 'excellent';

export type InjuryArea =
  | 'knee'
  | 'back'
  | 'shoulder'
  | 'ankle'
  | 'none';

export type Equipment =
  | 'scba'
  | 'jacket'
  | 'helmet'
  | 'boots'
  | 'ladder'
  | 'hose';

export type TrainingGoal =
  | 'weight-loss'
  | 'endurance'
  | 'initial-training'
  | 'operational-readiness'
  | 'promotion'
  | 'competition';

export type OnboardingProfile = {
  age?: number;
  sex?: BiologicalSex;
  heightCm?: number;
  weightKg?: number;
  role?: OperationalRole;
  experienceYears?: number;
  fitnessLevel?: FitnessLevel;
  injuries: InjuryArea[];
  equipment: Equipment[];
  availableMinutes?: number;
  goals: TrainingGoal[];
};
