import { UserRole } from '../enums';

/** Credentials submitted during login. */
export interface LoginInput {
  email: string;
  password: string;
}

/** Payload submitted during registration. */
export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

/** Sanitized user object returned by auth endpoints. */
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
}

/** Response from /auth/register and /auth/login. */
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
}

/** Result of GET /auth/me. */
export interface MeResponse {
  user: AuthUser;
}

/** Standard error body the API returns on failure. */
export interface ApiErrorBody {
  message: string;
  fieldErrors?: Record<string, string>;
  statusCode: number;
}

/** Generic pagination params. */
export interface PageParams {
  page?: number;
  pageSize?: number;
}