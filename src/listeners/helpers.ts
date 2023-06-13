import { GameData } from '../logic/types';
import { Server } from 'socket.io';
import { rooms } from '../routes/rooms';
import { Player } from '../routes/players/model';
import { SocketEvent } from './types';

export const updateTimers = (gameData: GameData) => {
  const now = Date.now();
  const prevRemainingTime = gameData.timers![gameData.currentPlayerId!];
  const timeFromLastStep = now - (gameData.previousStepTime ?? now);
  const remainingTime = prevRemainingTime - timeFromLastStep;

  gameData.timers![gameData.currentPlayerId!] = remainingTime < 0 ? 0 : remainingTime;
  gameData.previousStepTime = now;
};

export const gameOver = async (io: Server, roomId: string, winnerUserId: string) => {
  const room = rooms[roomId];

  if (!room || !room.gameData) return;

  for (const userId of Object.keys(room.players)) {
    const player = await Player.findOne({ userId: userId });

    if (player) {
      player.playedGames += 1;

      if (userId === winnerUserId) {
        player.rating += 40 - Math.floor(player.rating / 50);
      } else {
        const decrementRating = 20 + Math.floor(player.rating / 50);

        player.rating -= Math.max(0, player.rating - decrementRating);
      }

      await player.save();
    }
  }

  delete rooms[room.id];

  io.to(roomId).emit(SocketEvent.GameOver, { winnerUserId });

  const ioRoom = io.sockets.adapter.rooms.get(roomId);
  if (ioRoom) {
    for (const socketId of ioRoom) {
      io.sockets.sockets.get(socketId)?.disconnect(true);
    }
  }

  io.sockets.adapter.rooms.delete(roomId);
};
