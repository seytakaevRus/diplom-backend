import { Router } from 'express';

import lessonsController from '../controllers/lessons';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.get('/:id', verifyToken, lessonsController.getLesson);

export default router;
