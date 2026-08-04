import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.constants';
import type { SentinelDatabase } from '../../database/database.types';
import { users } from '../../database/schema';

export interface CreateUserInput {
  displayName: string;
  email: string;
  passwordHash: string;
}

export type UserRecord = typeof users.$inferSelect;

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: SentinelDatabase,
  ) {}

  async findByEmail(email: string): Promise<UserRecord | undefined> {
    const normalizedEmail = email.trim().toLowerCase();

    const [user] = await this.database
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    return user;
  }

  async findById(id: string): Promise<UserRecord | undefined> {
    const [user] = await this.database
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return user;
  }

  async create(input: CreateUserInput): Promise<UserRecord> {
    const [user] = await this.database
      .insert(users)
      .values({
        displayName: input.displayName.trim(),
        email: input.email.trim().toLowerCase(),
        passwordHash: input.passwordHash,
      })
      .returning();

    if (!user) {
      throw new Error('User could not be created');
    }

    return user;
  }
}
