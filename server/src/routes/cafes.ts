import { Router } from 'express';
import * as cafeController from '../controllers/cafeController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createCafeSchema, createReviewSchema } from '../validators/cafe.js';

const router = Router();

router.get('/', cafeController.listCafes);
router.get('/:slug', cafeController.getCafe);
router.post('/', requireAuth, validate({ body: createCafeSchema }), cafeController.createCafe);
router.get('/:slug/reviews', cafeController.getCafeReviews);
router.post(
  '/:slug/reviews',
  requireAuth,
  validate({ body: createReviewSchema }),
  cafeController.createCafeReview
);

export default router;