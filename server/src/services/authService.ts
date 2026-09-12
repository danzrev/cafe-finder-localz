import type { User } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { serializeUser } from '../utils/serializers.js';
import type { LoginBody, RegisterBody } from '../validators/auth.js';

export interface AuthResult {
  user: ReturnType<typeof serializeUser>;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async register(body: RegisterBody): Promise<AuthResult> {
    const email = body.email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw ApiError.conflict('An account with that email already exists.');

    const passwordHash = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: {
        email,
        name: body.name?.trim() || null,
        passwordHash,
      },
    });

    return this.buildAuthResult(user);
  },

  async login(body: LoginBody): Promise<AuthResult> {
    const email = body.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      // Same message for unknown email and wrong password — don't leak which.
      throw ApiError.unauthorized('Invalid email or password.');
    }

    return this.buildAuthResult(user);
  },

  async refresh(rawToken: string): Promise<{ user: ReturnType<typeof serializeUser>; accessToken: string }> {
    const claims = verifyRefreshToken(rawToken);

    const user = await prisma.user.findUnique({ where: { id: claims.sub } });
    if (!user) throw ApiError.unauthorized();

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    return { user: serializeUser(user), accessToken };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw ApiError.unauthorized();
    return serializeUser(user);
  },

  /** Build tokens + public user after successful register/login. */
  buildAuthResult(user: User): AuthResult {
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, email: user.email, role: user.role });
    return { user: serializeUser(user), accessToken, refreshToken };
  },
};