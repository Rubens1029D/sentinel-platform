import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { exercises } from '../schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const pool = new Pool({
  connectionString,
});

const database = drizzle({
  client: pool,
});

const exerciseCatalog: Array<typeof exercises.$inferInsert> = [
  {
    slug: 'bodyweight-squat',
    name: 'Sentadilla con peso corporal',
    description: 'Desarrolla fuerza y control del tren inferior.',
    category: 'strength',
    difficulty: 'beginner',
    impact: 'low',
    defaultRepetitions: 12,
    defaultSets: 3,
    restSeconds: 45,
    requiredEquipment: [],
    excludedForInjuries: ['knee'],
    instructions: [
      'Coloca los pies al ancho de los hombros.',
      'Desciende manteniendo el pecho elevado.',
      'Regresa empujando el suelo con ambos pies.',
    ],
    safetyNotes: [
      'Evita que las rodillas colapsen hacia adentro.',
      'Reduce la profundidad si aparece dolor.',
    ],
    isOperational: false,
  },
  {
    slug: 'incline-push-up',
    name: 'Flexión inclinada',
    description: 'Fortalece pecho, brazos y estabilidad del tronco.',
    category: 'strength',
    difficulty: 'beginner',
    impact: 'low',
    defaultRepetitions: 10,
    defaultSets: 3,
    restSeconds: 45,
    requiredEquipment: [],
    excludedForInjuries: ['shoulder'],
    instructions: [
      'Apoya las manos sobre una superficie firme.',
      'Mantén el cuerpo alineado.',
      'Desciende el pecho y extiende nuevamente los brazos.',
    ],
    safetyNotes: ['No eleves los hombros hacia las orejas.'],
    isOperational: false,
  },
  {
    slug: 'step-up',
    name: 'Subida a banco',
    description: 'Simula el patrón de subir escaleras.',
    category: 'operational',
    difficulty: 'beginner',
    impact: 'medium',
    defaultRepetitions: 10,
    defaultSets: 3,
    restSeconds: 45,
    requiredEquipment: [],
    excludedForInjuries: ['knee', 'ankle'],
    instructions: [
      'Apoya completamente un pie sobre el banco.',
      'Sube usando la pierna apoyada.',
      'Desciende con control y alterna piernas.',
    ],
    safetyNotes: ['Usa una superficie firme y estable.'],
    isOperational: true,
  },
  {
    slug: 'farmer-carry',
    name: 'Caminata del granjero',
    description: 'Desarrolla agarre, estabilidad y transporte de carga.',
    category: 'operational',
    difficulty: 'intermediate',
    impact: 'low',
    defaultDurationSeconds: 45,
    defaultSets: 4,
    restSeconds: 45,
    requiredEquipment: [],
    excludedForInjuries: ['back', 'shoulder'],
    instructions: [
      'Sujeta una carga a cada lado del cuerpo.',
      'Mantén el tronco erguido.',
      'Camina con pasos controlados.',
    ],
    safetyNotes: ['Evita inclinar el tronco hacia los lados.'],
    isOperational: true,
  },
  {
    slug: 'hose-dra',
    name: 'Arrastre de manguera',
    description: 'Simula el desplazamiento de una manguera en operación.',
    category: 'operational',
    difficulty: 'intermediate',
    impact: 'medium',
    defaultDurationSeconds: 40,
    defaultSets: 4,
    restSeconds: 60,
    requiredEquipment: ['hose'],
    excludedForInjuries: ['back', 'shoulder'],
    instructions: [
      'Sujeta la manguera con ambas manos.',
      'Mantén el tronco estable.',
      'Avanza con pasos cortos y constantes.',
    ],
    safetyNotes: ['No gires bruscamente la zona lumbar.'],
    isOperational: true,
  },
  {
    slug: 'ladder-carry',
    name: 'Transporte de escalera',
    description: 'Fortalece el levantamiento y transporte operativo.',
    category: 'operational',
    difficulty: 'advanced',
    impact: 'medium',
    defaultDurationSeconds: 45,
    defaultSets: 3,
    restSeconds: 75,
    requiredEquipment: ['ladder'],
    excludedForInjuries: ['back', 'shoulder'],
    instructions: [
      'Asegura un agarre rme.',
      'Levanta utilizando las piernas.',
      'Camina manteniendo la carga estable.',
    ],
    safetyNotes: [
      'Realiza el ejercicio con supervisión.',
      'No levantes la carga flexionando la espalda.',
    ],
    isOperational: true,
  },
  {
    slug: 'scba-walk',
    name: 'Caminata con SCBA',
    description: 'Mejora la tolerancia a carga y resistencia específica.',
    category: 'endurance',
    difficulty: 'intermediate',
    impact: 'low',
    defaultDurationSeconds: 600,
    defaultSets: 1,
    restSeconds: 60,
    requiredEquipment: ['scba'],
    excludedForInjuries: ['back'],
    instructions: [
      'Ajusta correctamente el equipo.',
      'Camina a ritmo controlado.',
      'Mantén una respiración estable.',
    ],
    safetyNotes: [
      'Detente ante mareo o dificultad respiratoria.',
      'Entrena en un entorno seguro y supervisado.',
    ],
    isOperational: true,
  },
  {
    slug: 'stair-climb',
    name: 'Subida de escaleras',
    description: 'Desarrolla resiste cardiovascular y fuerza de piernas.',
    category: 'endurance',
    difficulty: 'intermediate',
    impact: 'medium',
    defaultDurationSeconds: 300,
    defaultSets: 2,
    restSeconds: 90,
    requiredEquipment: [],
    excludedForInjuries: ['knee', 'ankle'],
    instructions: [
      'Sube a ritmo constante.',
      'Apoya completamente el pie.',
      'Desciende con control.',
    ],
    safetyNotes: ['Utiliza el pasamanos cuando sea necesario.'],
    isOperational: true,
  },
  {
    slug: 'victim-drag',
    name: 'Arrastre de víctima',
    description: 'Simula el traslado de una víctima durante un rescate.',
    category: 'operational',
    difficulty: 'advanced',
    impact: 'medium',
    defaultDurationSeconds: 30,
    defaultSets: 4,
    restSeconds: 90,
    requiredEquipment: [],
    excludedForInjuries: ['back', 'shoulder'],
    instructions: [
      'Adopta una posición estable.',
      'Mantén la carga cerca del cuerpo.',
      'Avanza utilizando piernas y cadera.',
    ],
    safetyNotes: [
      'Usa un maniquí diseñado para entrenamiento.',
      'Realiza el ejercicio con supervisión.',
    ],
    isOperational: true,
  },
  {
    slug: 'brisk-walk',
    name: 'Caminata rápida',
    description: 'Trabajo cardiovascular de bajo impacto.',
    category: 'cardio',
    difficulty: 'beginner',
    impact: 'low',
    defaultDurationSeconds: 900,
    defaultSets: 1,
    restSeconds: 0,
    requiredEquipment: [],
    excludedForInjuries: [],
    instructions: [
      'Mantén un ritmo moderado.',
      'Conserva una postura erguida.',
    ],
    safetyNotes: ['Reduce el ritmo ante dolor o mareo.'],
    isOperational: false,
  },
  {
    slug: 'hip-mobility',
    name: 'Movilidad de cadera',
    description: 'Mejora movilidad y recuperación del tren inferior.',
    category: 'mobility',
    difficulty: 'beginner',
    impact: 'low',
    defaultDurationSeconds: 300,
    defaultSets: 1,
    restSeconds: 0,
    requiredEquipment: [],
    excludedForInjuries: [],
    instructions: [
      'Realiza movimientos lentos.',
      'Trabaja dentro de un rango cómodo.',
    ],
    safetyNotes: ['No fuerces articulaciones dolorosas.'],
    isOperational: false,
  },
  {
    slug: 'breathing-recovery',
    name: 'Respiración de recuperación',
    description: 'Ayuda a controlar la respiración después del esfuerzo.',
    category: 'recovery',
    difficulty: 'beginner',
    impact: 'low',
    defaultDurationSeconds: 300,
    defaultSets: 1,
    restSeconds: 0,
    requiredEquipment: [],
    excludedForInjuries: [],
    instructions: [
      'Inhala lentamente por la nariz.',
      'Exhala de forma prolongada.',
      'Mantén una postura cómoda.',
    ],
    safetyNotes: ['Detente si aparece mareo.'],
    isOperational: false,
  },
];

async function seed(): Promise<void> {
  await database.insert(exercises).values(exerciseCatalog).onConflictDoNothing({
    target: exercises.slug,
  });

  console.log(`${exerciseCatalog.length} exercises prosuccessfully.`);
}

seed()
  .catch((error: unknown) => {
    console.error('Exercise seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
