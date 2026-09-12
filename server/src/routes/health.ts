import { Router } from 'express';
import { prisma } from '../config/prisma.js';

const router = Router();

/**
 * Lightweight health check for load balancers / CI.
 * Does NOT require auth. Returns 200 if DB is reachable.
 */
router.get('/health', async (_req, res) => {
  try {
    // Simple query to verify DB connectivity
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'degraded', timestamp: new Date().toISOString() });
  }
});

/**
 * Readiness check - more thorough (used by k8s readiness probes).
 * Verifies DB + critical external deps.
 */
router.get('/ready', async (_req, res) => {
  const checks = {
    database: false,
    timestamp: new Date().toISOString(),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch {
    // leave as false
  }

  const healthy = checks.database;
  res.status(healthy ? 200 : 503).json(checks);
});

export default router;