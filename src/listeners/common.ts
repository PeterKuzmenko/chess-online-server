import { rooms } from '../routes/rooms';
import { Room } from '../routes/rooms/types';

export const getToggledPlayerId = (room: Room) => {
  const playersIds = Object.keys(room.players);
  const currentPlayerId = room.gameData?.currentPlayerId;

  for (const playerId of playersIds) {
    if (currentPlayerId !== playerId) return playerId;
  }

  return currentPlayerId!;
};

export const toggleCurrentPlayerId = (roomId: string) => {
  const room = rooms[roomId];

  if (room.gameData) {
    room.gameData.currentPlayerId = getToggledPlayerId(room);
  }
};
