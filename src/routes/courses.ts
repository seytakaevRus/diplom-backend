import { Router } from 'express';

import coursesController from '../controllers/courses';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.get('/:id', verifyToken,  coursesController.getCourse);
router.get('/', verifyToken, coursesController.getAllCourses);

export default router;
