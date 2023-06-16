import express, { Router } from 'express';

import apiRouter from './api';
import path from 'path';

import { publicDirectory, staticDirectory } from '../paths';

const router = Router();

router.use('/static', express.static(staticDirectory));

router.use('/api', apiRouter);

router.use(express.static(publicDirectory));
router.get('*', (req, res) => {
  res.sendFile(path.join(publicDirectory, 'index.html'));
});

export default router;
