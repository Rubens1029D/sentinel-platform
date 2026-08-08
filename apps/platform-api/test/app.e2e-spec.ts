/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { AppModule } from '../src/app.module';

interface AuthenticationResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface GeneratedExercise {
  id: string;
  repetitions: number | null;
  durationSeconds: number | null;
}

interface GeneratedSession {
  id: string;
  exercises: GeneratedExercise[];
}

interface GeneratedPlan {
  id: string;
  status: string;
  sessions: GeneratedSession[];
}

interface ProgressResponse {
  completedPlans: number;
  completedSessions: number;
  completedExercises: number;
  totalTrainingMinutes: number;
  completionRate: number;
}

describe('Sentinel Platform API (e2e)', () => {
  let app: INestApplication<App>;
  let accessToken: string;
  let generatedPlan: GeneratedPlan;

  const email = `sentinel.e2e.${Date.now()}@example.com`;

  const password = 'Password123!';

  const authorization = () => ({
    Authorization: `Bearer ${accessToken}`,
  });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health', () => {
    it('GET /health returns API liveness', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'ok',
        service: 'platform-api',
      });
    });

    it('GET /health/ready returns database readiness', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/health/ready')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'ready',
        service: 'platform-api',
        database: 'up',
      });
    });
  });

  describe('Authentication', () => {
    it('rejects an invalid register DTO', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          email: 'not-an-email',
          password: '123',
        })
        .expect(400);
    });

    it('registers a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          name: 'Sentinel E2E User',
          email,
          password,
        })
        .expect(201);

      const body = response.body as AuthenticationResponse;

      expect(body.accessToken).toBeDefined();
      expect(body.user.email).toBe(email);

      accessToken = body.accessToken;
    });

    it('logs in successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          email,
          password,
        })
        .expect(200);

      const body = response.body as AuthenticationResponse;

      expect(body.accessToken).toBeDefined();
      expect(body.user.email).toBe(email);

      accessToken = body.accessToken;
    });

    it('GET /auth/me requires JWT', async () => {
      await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
    });

    it('GET /auth/me returns authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/auth/me')
        .set(authorization())
        .expect(200);

      expect(response.body).toMatchObject({
        email,
      });
    });
  });

  describe('Profile', () => {
    it('completes the user profile', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/profile/complete')
        .set(authorization())
        .send({
          age: 35,
          sex: 'male',
          heightCm: 175,
          weightKg: 85,
          role: 'firefighter',
          experienceYears: 8,
          fitnessLevel: 'good',
          injuries: ['none'],
          equipment: ['scba', 'jacket', 'helmet', 'boots'],
          availableMinutes: 45,
          goals: ['operational-readiness', 'endurance'],
        })
        .expect(201);

      expect(response.body).toMatchObject({
        age: 35,
        role: 'firefighter',
      });
    });

    it('returns the authenticated user profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/profile/me')
        .set(authorization())
        .expect(200);

      expect(response.body).toMatchObject({
        age: 35,
        role: 'firefighter',
      });
    });
  });

  describe('Training generation', () => {
    it('previews a training plan', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/training/preview')
        .set(authorization())
        .expect(201);

      expect(Array.isArray(response.body.sessions)).toBe(true);

      expect(response.body.sessions.length).toBeGreaterThan(0);
    });

    it('generates and persists a training plan', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/training/generate')
        .set(authorization())
        .expect(201);

      generatedPlan = response.body as GeneratedPlan;

      expect(generatedPlan.id).toBeDefined();
      expect(generatedPlan.status).toBe('active');

      expect(generatedPlan.sessions.length).toBeGreaterThan(0);
    });

    it('returns the active training plan', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/training/current')
        .set(authorization())
        .expect(200);

      expect(response.body.id).toBe(generatedPlan.id);
    });
  });

  describe('Training execution', () => {
    it('completes every session and exercise', async () => {
      for (const session of generatedPlan.sessions) {
        await request(app.getHttpServer())
          .patch(`/api/v1/training/session/${session.id}/start`)
          .set(authorization())
          .expect(200);

        for (const exercise of session.exercises) {
          const execution: {
            actualRepetitions?: number;
            actualDurationSeconds?: number;
          } = {};

          if (exercise.repetitions !== null) {
            execution.actualRepetitions = exercise.repetitions;
          }

          if (exercise.durationSeconds !== null) {
            execution.actualDurationSeconds = exercise.durationSeconds;
          }

          const response = await request(app.getHttpServer())
            .patch(`/api/v1/training/exercise/${exercise.id}/complete`)
            .set(authorization())
            .send(execution)
            .expect(200);

          expect(response.body.completed).toBe(true);
        }
      }
    });

    it('no longer returns an active plan after completion', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/training/current')
        .set(authorization())
        .expect(404);
    });
  });

  describe('Training history and progress', () => {
    it('returns the completed plan in history', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/training/history')
        .set(authorization())
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      expect(
        response.body.some(
          (plan: { id: string }) => plan.id === generatedPlan.id,
        ),
      ).toBe(true);
    });

    it('returns historical plan detail', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/training/history/${generatedPlan.id}`)
        .set(authorization())
        .expect(200);

      expect(response.body.id).toBe(generatedPlan.id);

      expect(response.body.status).toBe('completed');
    });

    it('returns accumulated progress', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/training/progress')
        .set(authorization())
        .expect(200);

      const body = response.body as ProgressResponse;

      expect(body.completedPlans).toBeGreaterThanOrEqual(1);

      expect(body.completedSessions).toBeGreaterThanOrEqual(
        generatedPlan.sessions.length,
      );

      expect(body.completedExercises).toBeGreaterThan(0);

      expect(body.totalTrainingMinutes).toBeGreaterThan(0);

      expect(body.completionRate).toBe(100);
    });

    it('returns weekly statistics', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/training/stats/weekly')
        .set(authorization())
        .expect(200);

      expect(response.body.period).toBeDefined();
      expect(response.body.days).toHaveLength(7);
    });

    it('returns monthly statistics', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/training/stats/monthly')
        .set(authorization())
        .expect(200);

      expect(response.body.period).toBeDefined();

      expect(Array.isArray(response.body.weeks)).toBe(true);
    });
  });

  describe('Dashboard', () => {
    it('returns the aggregated dashboard', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/dashboard')
        .set(authorization())
        .expect(200);

      expect(response.body.summary).toBeDefined();
      expect(response.body.progress).toBeDefined();
      expect(response.body.weeklyStats).toBeDefined();
      expect(response.body.monthlyStats).toBeDefined();

      expect(response.body.currentTraining).toBeNull();
    });
  });

  describe('Notifications', () => {
    it('creates or returns notification preferences', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/notifications/preferences')
        .set(authorization())
        .expect(200);

      expect(response.body.enabled).toBe(true);
    });

    it('updates notification preferences', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/v1/notifications/preferences')
        .set(authorization())
        .send({
          enabled: true,
          trainingReminders: true,
          streakReminders: true,
          reminderHour: 0,
          timezone: 'UTC',
        })
        .expect(200);

      expect(response.body.reminderHour).toBe(0);

      expect(response.body.timezone).toBe('UTC');
    });

    it('calculates pending notifications', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/notifications/pending')
        .set(authorization())
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
