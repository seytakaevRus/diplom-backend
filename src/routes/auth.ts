import { Router } from 'express';
import authController from '../controllers/auth';

const router = Router();

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.get('/whoami', authController.whoAmI);

export default router;
