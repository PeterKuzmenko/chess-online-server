import { Request, Response } from 'express';
import path from 'path';
import * as fs from 'fs';

import { Player } from './model';
import { ChangeUsernamePayload, GetPlayersParams, UpdateUserInfoPayload } from './types';
import { rootDirectory } from '../../storage';
import { User } from '../auth/model';

class PlayersController {
  async getPlayer(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const player = await Player.findOne({ userId }).select(['-_id', '-__v']);

      return res.json(player);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  async getPlayers(req: Request<GetPlayersParams>, res: Response) {
    try {
      const { search } = req.query;
      const players = await Player.find(
        search ? { username: new RegExp('^' + search) } : {},
      ).select(['username', 'userId', '-_id']);

      return res.json(players);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  async updatePlayerInfo(req: Request<UpdateUserInfoPayload>, res: Response) {
    try {
      const user = res.locals.user;
      const { status, description } = req.body;
      const player = await Player.findOneAndUpdate(
        { userId: user.id },
        { status, description },
        { new: true },
      );

      if (!player) {
        return res.status(400).json({ message: 'There is no such a user' });
      }

      return res.json(player);
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  async uploadAvatar(req: Request, res: Response) {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
      } else {
        const filename = req.file.filename;
        const url = '/static/' + filename;

        const user = res.locals.user;
        await Player.findOneAndUpdate({ userId: user.id }, { avatarUrl: url });

        res.json({ message: 'File uploaded successfully', filePath: url });
      }
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  async removeAvatar(req: Request, res: Response) {
    try {
      const user = res.locals.user;

      const player = await Player.findOne({ userId: user.id }).select('avatarUrl');

      if (player?.avatarUrl) {
        const avatarPath = path.join(rootDirectory, player.avatarUrl);

        if (fs.existsSync(avatarPath)) {
          fs.unlinkSync(avatarPath);
        } else {
          return res.status(404).json({ error: 'Avatar not found' });
        }

        player.avatarUrl = undefined;
        await player.save();
      }

      res.json({ message: 'Avatar removed successfully' });
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  async changeUsername(req: Request<ChangeUsernamePayload>, res: Response) {
    try {
      const user = res.locals.user;
      const username = req.body.username;

      const userAlreadyExists = !!(await User.findOne({ username }));
      if (userAlreadyExists) {
        return res.status(400).json({ message: 'User with such name already exists' });
      }

      await User.findOneAndUpdate({ _id: user.id }, { username });
      await Player.findOneAndUpdate({ userId: user.id }, { username });

      res.json({ message: 'Successfully changed username' });
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
}

export default new PlayersController();
