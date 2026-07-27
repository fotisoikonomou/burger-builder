import { request } from './client';
import type { LoginResponse } from '../types';

export const login = (username: string, password: string): Promise<LoginResponse> =>
  request<LoginResponse>('/login', {
    method: 'POST',
    body: { username, password },
  });
