import { API_URL } from './config';
import { getAccessToken } from './token-storage';

type ApiRequestOptions = Omit<
  RequestInit,
  'headers'
> & {
  headers?: Record<string, string>;
  authenticated?: boolean;
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly payload: unknown,
  ) {
    super(
      ApiError.resolveMessage(payload),
    );

    this.name = 'ApiError';
  }

  private static resolveMessage(
    payload: unknown,
  ): string {
    if (
      payload &&
      typeof payload === 'object' &&
      'message' in payload
    ) {
      const message = payload.message;

      if (typeof message === 'string') {
        return message;
      }

      if (Array.isArray(message)) {
        return message.join(', ');
      }
    }

    return 'Ocurrió un error al comunicarse con el servidor.';
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    authenticated = false,
    headers = {},
    ...requestOptions
  } = options;

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };

  if (
    requestOptions.body &&
    !requestHeaders['Content-Type']
  ) {
    requestHeaders['Content-Type'] =
      'application/json';
  }

  if (authenticated) {
    const token =
      await getAccessToken();

    if (token) {
      requestHeaders.Authorization =
        `Bearer ${token}`;
    }
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...requestOptions,
      headers: requestHeaders,
    },
  );

  let payload: unknown = null;

  const contentType =
    response.headers.get('content-type');

  if (
    contentType?.includes(
      'application/json',
    )
  ) {
    payload = await response.json();
  } else {
    const text = await response.text();

    payload = text || null;
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload,
    );
  }

  return payload as T;
}