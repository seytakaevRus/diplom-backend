import { Router } from 'express';

import lessonsController from '../controllers/lessons';

const router = Router();

router.get('/:id', lessonsController.getLesson);

export default router;
