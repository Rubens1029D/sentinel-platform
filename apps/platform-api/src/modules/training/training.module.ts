import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TrainingRepository } from './repositories/training.repository';
import { TrainingController } from './training.controller';
import { TrainingService } from './training.service';

@Module({
  imports: [AuthModule],
  controllers: [TrainingController],
  providers: [TrainingService, TrainingRepository],
  exports: [TrainingService],
})
export class TrainingModule {}
