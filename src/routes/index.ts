import { Router } from 'express';

import { authMiddleware } from '../middlewares';

import roomsRouter from './rooms';
import authRouter from './auth';
import playersRouter from './players';

const router = Router();

router.use('/rooms', [authMiddleware], roomsRouter);
router.use('/players', [authMiddleware], playersRouter);
router.use('/auth', authRouter);

export default router;
