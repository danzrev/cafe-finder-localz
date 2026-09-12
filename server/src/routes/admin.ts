import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { adminUpdateCafeSchema } from '../validators/cafe.js';

const router = Router();
router.use(requireAuth, requireAdmin);

router.get('/cafes', adminController.adminListCafes);
router.patch('/cafes/:id/status', adminController.adminUpdateCafeStatus);
router.patch('/cafes/:id', validate({ body: adminUpdateCafeSchema }), adminController.adminUpdateCafe);
router.get('/claims', adminController.adminListClaims);
router.patch('/claims/:id', adminController.adminDecideClaim);
router.get('/users', adminController.adminListUsers);

export default router;