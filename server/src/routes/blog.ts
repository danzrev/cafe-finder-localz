import { Router } from 'express';
import * as blogController from '../controllers/blogController.js';
import { validate } from '../middleware/validate.js';
import { createPostSchema, slugParamSchema } from '../validators/blog.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', blogController.listPosts);
router.get('/:slug', validate({ params: slugParamSchema }), blogController.getPost);
router.post('/', requireAuth, requireAdmin, validate({ body: createPostSchema }), blogController.createPost);

export default router;