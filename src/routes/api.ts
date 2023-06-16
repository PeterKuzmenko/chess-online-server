import { Router } from 'express';

import { authMiddleware } from '../middlewares';

import roomsRouter from './rooms';
import authRouter from './auth';
import playersRouter from './players';

const apiRouter = Router();

apiRouter.use('/rooms', [authMiddleware], roomsRouter);
apiRouter.use('/players', [authMiddleware], playersRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;
