import { Router } from 'express';
import { check } from 'express-validator';
import controller from './controller';
import { validateMiddleware } from '../../middlewares';

const authRouter = Router();

authRouter.post(
  '/registration',
  [
    check('username', 'Username is empty').notEmpty(),
    check('password', 'Password must be more than 4 symbols and less than 20').isLength({
      min: 4,
      max: 20,
    }),
    validateMiddleware,
  ],
  controller.register,
);
authRouter.post('/login', controller.login);

export default authRouter;
