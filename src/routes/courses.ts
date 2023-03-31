import { Router } from 'express';

import coursesController from '../controllers/courses';

const router = Router();

router.get('/:id', coursesController.getCourse);
router.get('/', coursesController.getAllCourses);

export default router;
