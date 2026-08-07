import { Injectable } from '@nestjs/common';
import { TrainingService } from '../training/training.service';

@Injectable()
export class DashboardService {
  constructor(private readonly trainingService: TrainingService) {}

  async getDashboardForUser(userId: string) {
    const [progress, weeklyStats, monthlyStats] = await Promise.all([
      this.trainingService.getProgressForUser(userId),
      this.trainingService.getWeeklyStatsForUser(userId),
      this.trainingService.getMonthlyStatsForUser(userId),
    ]);

    let currentTraining = null;

    try {
      currentTraining = await this.trainingService.getCurrentForUser(userId);
    } catch {
      currentTraining = null;
    }

    return {
      summary: {
        currentStreak: progress.currentStreak,
        weeklySessions: weeklyStats.completedSessions,
        weeklyMinutes: weeklyStats.trainingMinutes,
        completionRate: progress.completionRate,
        hasActiveTraining: currentTraining !== null,
      },
      progress,
      weeklyStats,
      monthlyStats,
      currentTraining,
    };
  }
}
