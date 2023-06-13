import { Router, Request } from 'express';
import { Room } from './types';
import { v4 } from 'uuid';

export const rooms: Record<string, Room> = {};
const roomsRouter = Router();

type CreateRoomPayload = { name: string; password?: string };

roomsRouter
  .route('/')
  .get((req, res) => {
    try {
      const mappedRooms = Object.values(rooms).map(({ name, id }) => ({
        name,
        id,
      }));

      res.json({ rooms: mappedRooms });
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  })
  .post((req: Request<CreateRoomPayload>, res) => {
    try {
      const { name, password } = req.body;
      if (Object.values(rooms).find(x => x.name === name)) {
        return res.status(400).json({ message: 'Room already exist' });
      }

      const roomId = v4();
      rooms[roomId] = { name, password, id: roomId, players: {} };

      res.json({ name, id: roomId });
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' });
    }
  });

roomsRouter.route('/deleteRoom').post((req, res) => {
  try {
    const roomId = req.body.id;

    if (rooms[roomId]?.gameOverTimerId) {
      clearTimeout(rooms[roomId]?.gameOverTimerId);
    }

    delete rooms[roomId];

    res.json({ message: 'Success' });
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default roomsRouter;
