import { Router } from 'express';

import testQuestionsController from '../controllers/testQuestions';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

router.get('/by-course/:id', verifyToken, testQuestionsController.getTestQuestionsByCourseId);

export default router;
