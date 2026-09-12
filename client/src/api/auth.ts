import { api } from './client';
import { AuthTokens, LoginInput, MeResponse, RegisterInput } from '@cafefinder/shared';

export const authApi = {
  register(input: RegisterInput): Promise<AuthTokens> {
    return api.request('/auth/register', { method: 'POST', body: input });
  },

  login(input: LoginInput): Promise<AuthTokens> {
    return api.request('/auth/login', { method: 'POST', body: input });
  },

  logout(): Promise<void> {
    return api.request('/auth/logout', { method: 'POST' });
  },

  me(): Promise<MeResponse> {
    return api.request('/auth/me');
  },
};