import { Room } from './types';

const rooms: Record<string, Room> = {};

export default {
  getRoomsInfo: () => {
    return Object.values(rooms).map(({ name, id }) => ({ name, id }));
  },
  joinRoom: (roomId: number, userId: string, socketId: string) => {
    const room = rooms[roomId];

    if (!room) {
      throw new Error('Room does not exist');
    }

    const alreadyInRoom = Object.values(room.players).find(x => x.userId === userId);

    if (alreadyInRoom) {
      throw new Error('Already in room');
    }

    room.players[userId] = {
      socketId,
      userId,
    };
  },
};
