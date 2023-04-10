import { Router } from 'express';

import reviewsController from '../controllers/reviews';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.post('/', verifyToken, reviewsController.createReview);
router.get('/by-course/:id', verifyToken, reviewsController.getReviewsByCourseId);

export default router;
