import { useSyncExternalStore } from 'react';

import { ApiError } from '@/services/api/api-client';
import {
  getCurrentUserRequest,
  loginRequest,
  registerRequest,
} from '@/services/api/auth-api';
import {
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from '@/services/api/token-storage';
import type {
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from '@/types/auth';

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  initialized: boolean;
};

let state: AuthState = {
  user: null,
  accessToken: null,
  initialized: false,
};

const listeners = new Set<() => void>();

let restorePromise:
  | Promise<AuthUser | null>
  | null = null;

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function setAuthState(
  nextState: Partial<AuthState>,
) {
  state = {
    ...state,
    ...nextState,
  };

  emitChange();
}

function subscribe(
  listener: () => void,
) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

export function getAuthState() {
  return state;
}

export function useAuthStore() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );
}

async function persistSession(
  response: AuthResponse,
) {
  await saveAccessToken(
    response.accessToken,
  );

  setAuthState({
    user: response.user,
    accessToken: response.accessToken,
    initialized: true,
  });

  return response;
}

export async function login(
  payload: LoginPayload,
) {
  const response =
    await loginRequest(payload);

  return persistSession(response);
}

export async function register(
  payload: RegisterPayload,
) {
  const response =
    await registerRequest(payload);

  return persistSession(response);
}

async function performRestoreSession() {
  const token =
    await getAccessToken();

  if (!token) {
    setAuthState({
      initialized: true,
      user: null,
      accessToken: null,
    });

    return null;
  }

  try {
    const user =
      await getCurrentUserRequest();

    setAuthState({
      initialized: true,
      user,
      accessToken: token,
    });

    return user;
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 401
    ) {
      await removeAccessToken();

      setAuthState({
        initialized: true,
        user: null,
        accessToken: null,
      });

      return null;
    }

    setAuthState({
      initialized: true,
      user: null,
      accessToken: token,
    });

    return null;
  }
}

export function restoreSession() {
  if (state.initialized) {
    return Promise.resolve(state.user);
  }

  if (!restorePromise) {
    restorePromise =
      performRestoreSession().finally(() => {
        restorePromise = null;
      });
  }

  return restorePromise;
}

export async function logout() {
  await removeAccessToken();

  setAuthState({
    user: null,
    accessToken: null,
    initialized: true,
  });
}