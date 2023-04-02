import { Router } from 'express';

import authController from '../controllers/auth';
import {verifyToken} from '../middleware/verifyToken';

const router = Router();

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.get('/whoami', verifyToken, authController.whoAmI);

export default router;
