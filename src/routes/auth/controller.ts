import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { secret } from '../../config';
import { User } from './model';
import { AuthPayload } from './types';
import { Player } from '../players/model';

class AuthController {
  async register(req: Request<AuthPayload>, res: Response) {
    try {
      const { username, password } = req.body;

      const userAlreadyExists = !!(await User.findOne({ username }));
      if (userAlreadyExists) {
        return res.status(400).json({ message: 'User with such name already exists' });
      }

      const hashedPassword = bcrypt.hashSync(password, 5);
      const user = new User({ username, password: hashedPassword });
      user.save();

      const nowDateISOString = new Date().toISOString();
      const player = new Player({
        username,
        userId: user._id,
        accountCreated: nowDateISOString,
      });
      player.save();

      const token = jwt.sign({ id: user._id }, secret, { expiresIn: '24h' });
      res.json({ token, userId: user._id });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const sendLoginError = () =>
        res.status(400).json({ message: 'Username or password is not correct' });

      const user = await User.findOne({ username });
      if (!user) {
        return sendLoginError();
      }

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (!isPasswordCorrect) {
        return sendLoginError();
      }

      const token = jwt.sign({ id: user._id }, secret, { expiresIn: '24h' });
      res.json({ token, userId: user._id });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
}

export default new AuthController();
