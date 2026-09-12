import 'dotenv/config';

/**
 * Typed access to environment variables with sane defaults and validation.
 * Secrets are never logged and never sent to the client.
 */

function int(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function commaList(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProd: (process.env.NODE_ENV ?? 'development') === 'production',

  port: int(process.env.PORT, 4000),

  databaseUrl: process.env.DATABASE_URL ?? '',

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret',
    accessTtlMin: int(process.env.JWT_ACCESS_TTL_MIN, 15),
    refreshTtlDays: int(process.env.JWT_REFRESH_TTL_DAYS, 30),
  },

  corsOrigin: commaList(process.env.CORS_ORIGIN),
  cookieSecure: process.env.COOKIE_SECURE === 'true',

  rateLimit: {
    windowMs: int(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
    max: int(process.env.RATE_LIMIT_MAX, 300),
    authMax: int(process.env.AUTH_RATE_LIMIT_MAX, 10),
  },

  mapsServerKey: process.env.MAPS_SERVER_API_KEY ?? '',

  storage: {
    endpoint: process.env.STORAGE_ENDPOINT ?? '',
    bucket: process.env.STORAGE_BUCKET ?? '',
    accessKey: process.env.STORAGE_ACCESS_KEY ?? '',
    secretKey: process.env.STORAGE_SECRET_KEY ?? '',
  },
} as const;

export type AppEnv = typeof env;