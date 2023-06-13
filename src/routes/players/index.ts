import { Router } from 'express';

import controller from './controller';
import { uploadFile } from '../../storage';
import { check } from 'express-validator';
import { validateMiddleware } from '../../middlewares';

const playersRouter = Router();

playersRouter.get('/', controller.getPlayers);
playersRouter.get('/:id', controller.getPlayer);
playersRouter.patch('/update', controller.updatePlayerInfo);
playersRouter.post('/uploadAvatar', [uploadFile.single('avatar')], controller.uploadAvatar);
playersRouter.delete('/removeAvatar', controller.removeAvatar);
playersRouter.patch(
  '/changeUsername',
  [check('username', 'Username is empty').notEmpty(), validateMiddleware],
  controller.changeUsername,
);

export default playersRouter;
