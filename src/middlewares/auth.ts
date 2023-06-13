import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../config';

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'User is not authorized' });
    }

    const decodedUser = jwt.verify(token, secret);
    if (decodedUser) {
      res.locals.user = decodedUser;
      next();
    }
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: 'User is not authorized' });
  }
};
