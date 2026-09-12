import { Router } from 'express';
import * as ownerController from '../controllers/ownerController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/cafes', ownerController.listMine);
router.post('/claims', ownerController.submitClaim);
router.get('/claims', ownerController.listMyClaims);

export default router;