import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export enum BiologicalSex {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum OperationalRole {
  Firefighter = 'firefighter',
  IndustrialBrigade = 'industrial-brigade',
  CivilProtection = 'civil-protection',
  Rescuer = 'rescuer',
}

export enum FitnessLevel {
  VeryLow = 'very-low',
  Low = 'low',
  Medium = 'medium',
  Good = 'good',
  Excellent = 'excellent',
}

export enum InjuryArea {
  Knee = 'knee',
  Back = 'back',
  Shoulder = 'shoulder',
  Ankle = 'ankle',
  None = 'none',
}

export enum Equipment {
  Scba = 'scba',
  Jacket = 'jacket',
  Helmet = 'helmet',
  Boots = 'boots',
  Ladder = 'ladder',
  Hose = 'hose',
}

export enum TrainingGoal {
  WeightLoss = 'weight-loss',
  Endurance = 'endurance',
  InitialTraining = 'initial-training',
  OperationalReadiness = 'operational-readiness',
  Promotion = 'promotion',
  Competition = 'competition',
}

export class CompleteProfileDto {
  @IsInt()
  @Min(18)
  @Max(100)
  age!: number;

  @IsEnum(BiologicalSex)
  sex!: BiologicalSex;

  @IsInt()
  @Min(120)
  @Max(230)
  heightCm!: number;

  @IsNumber()
  @Min(35)
  @Max(350)
  weightKg!: number;

  @IsEnum(OperationalRole)
  role!: OperationalRole;

  @IsInt()
  @Min(0)
  @Max(70)
  experienceYears!: number;

  @IsEnum(FitnessLevel)
  fitnessLevel!: FitnessLevel;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsEnum(InjuryArea, { each: true })
  injuries!: InjuryArea[];

  @IsArray()
  @ArrayMaxSize(6)
  @IsEnum(Equipment, { each: true })
  equipment!: Equipment[];

  @IsInt()
  @Min(10)
  @Max(240)
  availableMinutes!: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @IsEnum(TrainingGoal, { each: true })
  goals!: TrainingGoal[];
}
