import { Module } from '@nestjs/common';
import { TrainingModule } from '../training/training.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TrainingModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
