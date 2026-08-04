import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.constants';
import type { SentinelDatabase } from '../../database/database.types';
import { profiles } from '../../database/schema';
import { CompleteProfileDto } from './dto/complete-profile.dto';

export type ProfileRecord = typeof profiles.$inferSelect;

@Injectable()
export class ProfileService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: SentinelDatabase,
  ) {}

  async complete(
    userId: string,
    dto: CompleteProfileDto,
  ): Promise<ProfileRecord> {
    const [profile] = await this.database
      .insert(profiles)
      .values({
        userId,
        age: dto.age,
        sex: dto.sex,
        heightCm: dto.heightCm,
        weightKg: dto.weightKg,
        role: dto.role,
        experienceYears: dto.experienceYears,
        fitnessLevel: dto.fitnessLevel,
        injuries: dto.injuries,
        equipment: dto.equipment,
        availableMinutes: dto.availableMinutes,
        goals: dto.goals,
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          age: dto.age,
          sex: dto.sex,
          heightCm: dto.heightCm,
          weightKg: dto.weightKg,
          role: dto.role,
          experienceYears: dto.experienceYears,
          fitnessLevel: dto.fitnessLevel,
          injuries: dto.injuries,
          equipment: dto.equipment,
          availableMinutes: dto.availableMinutes,
          goals: dto.goals,
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!profile) {
      throw new Error('Profile could not be saved');
    }

    return profile;
  }

  async findByUserId(userId: string): Promise<ProfileRecord> {
    const [profile] = await this.database
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (!profile) {
      throw new NotFoundException('Profile has not been completed');
    }

    return profile;
  }
}
