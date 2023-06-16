import express, { Router } from 'express';

import { authMiddleware } from '../middlewares';

import roomsRouter from './rooms';
import authRouter from './auth';
import playersRouter from './players';
import path from 'path';

import { publicDirectory, staticDirectory } from '../paths';

const router = Router();

router.use('/static', express.static(staticDirectory));

router.use('/rooms', [authMiddleware], roomsRouter);
router.use('/players', [authMiddleware], playersRouter);
router.use('/auth', authRouter);

router.use(express.static(publicDirectory));
router.get('*', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'));
});

export default router;
