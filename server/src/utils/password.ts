import { hash, verify } from 'argon2';

/** Argon2id hash of a plaintext password. */
export async function hashPassword(plain: string): Promise<string> {
  return hash(plain);
}

/** Safely compare a plaintext password against a stored Argon2 hash. */
export async function verifyPassword(plain: string, storedHash: string): Promise<boolean> {
  try {
    return await verify(storedHash, plain);
  } catch {
    return false;
  }
}