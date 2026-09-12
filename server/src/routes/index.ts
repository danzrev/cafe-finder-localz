import { Router } from 'express';
import { apiLimiter } from '../config/rateLimit.js';
import authRouter from './auth.js';
import cafeRouter from './cafes.js';
import blogRouter from './blog.js';
import savedRouter from './saved.js';
import ownerRouter from './owner.js';
import adminRouter from './admin.js';
import healthRouter from './health.js';

const router = Router();

// Health probes (no rate limit, no auth).
router.use('/health', healthRouter);
router.use('/ready', healthRouter);;

// Rate-limit everything under /api.
router.use(apiLimiter);

router.use('/auth', authRouter);
router.use('/cafes', cafeRouter);
router.use('/blog', blogRouter);
router.use('/saved', savedRouter);
router.use('/owner', ownerRouter);
router.use('/admin', adminRouter);

export default router;