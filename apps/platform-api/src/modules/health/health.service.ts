import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.constants';
import type { SentinelDatabase } from '../../database/database.types';

@Injectable()
export class HealthService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: SentinelDatabase,
  ) {}

  getHealth() {
    return {
      status: 'ok',
      service: 'platform-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }

  async getReadiness() {
    try {
      await this.db.execute(sql`select 1`);

      return {
        status: 'ready',
        service: 'platform-api',
        database: 'up',
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'not-ready',
        service: 'platform-api',
        database: 'down',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
