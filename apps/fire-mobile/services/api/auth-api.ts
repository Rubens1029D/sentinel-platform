import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '@/types/auth';

import { apiRequest } from './api-client';

export function loginRequest(
  payload: LoginPayload,
) {
  return apiRequest<AuthResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export function registerRequest(
  payload: RegisterPayload,
) {
  return apiRequest<AuthResponse>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
  );
}

export function getCurrentUserRequest() {
  return apiRequest<AuthUser>(
    '/auth/me',
    {
      authenticated: true,
    },
  );
}
