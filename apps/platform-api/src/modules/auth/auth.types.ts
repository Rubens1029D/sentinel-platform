import type { PublicUser } from './auth.service';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthenticatedRequest {
  user: PublicUser;
}
