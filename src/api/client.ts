import { API_BASE_URL } from './config';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const isUnauthorized = (error: unknown): boolean =>
  error instanceof ApiError && error.status === 401;

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  token?: string | null;
}

/**
 * Thin fetch wrapper: JSON in/out, Bearer auth, typed errors.
 * Keeps endpoint modules (auth, ingredients) free of transport details.
 */
export async function request<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Network error — check your connection and try again.', 0);
  }

  if (!response.ok) {
    throw new ApiError(defaultMessageFor(response.status), response.status);
  }

  return (await response.json()) as T;
}

function defaultMessageFor(status: number): string {
  switch (status) {
    case 401:
      return 'Your session is invalid or has expired.';
    case 400:
      return 'The request was rejected. Check your input and try again.';
    default:
      return `The server responded with an unexpected error (${status}).`;
  }
}
