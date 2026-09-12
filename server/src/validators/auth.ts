import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '@cafefinder/shared';

const email = z.string().trim().toLowerCase().email('Enter a valid email address.');

export const registerSchema = z.object({
  email,
  name: z.string().trim().max(80).optional(),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
    .max(128),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required.'),
});

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;