import { Router } from 'express';
import * as savedController from '../controllers/savedController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', savedController.listSaved);
router.put('/:cafeId', savedController.setSaved);
router.get('/:cafeId/status', savedController.savedStatus);

export default router;