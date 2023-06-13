import { Server, Socket } from 'socket.io';
import { rooms } from '../../routes/rooms';
import { ClientGameData, PawnCanBeTurnInto, Position } from '../../logic/types';
import { SocketEvent, StandardRoomArgs } from '../types';
import { getToggledPlayerId, toggleCurrentPlayerId } from '../common';
import { gameOver, updateTimers } from '../helpers';

type StepActionArgs = StandardRoomArgs & {
  from: Position;
  to: Position;
  turnInto?: PawnCanBeTurnInto;
};

export const onStepAction = (
  socket: Socket,
  io: Server,
  { from, to, roomId, turnInto }: StepActionArgs,
) => {
  const userId = socket.userId;
  const room = rooms[roomId];

  if (!room?.gameData || userId !== room.gameData?.currentPlayerId) return;

  const isMoveSuccessful = room.gameData.board.moveFigure(from, to, turnInto);

  if (isMoveSuccessful) {
    if (!room.gameData.gameStarted) {
      room.gameData.gameStarted = true;
    }

    updateTimers(room.gameData);
    toggleCurrentPlayerId(roomId);

    if (room.gameOverTimerId) {
      clearTimeout(room.gameOverTimerId);
    }

    const timeToGameOver = room.gameData.timers![room.gameData.currentPlayerId!];
    room.gameOverTimerId = setTimeout(() => {
      const winnerUserId = getToggledPlayerId(room);
      gameOver(io, roomId, winnerUserId);
    }, timeToGameOver);

    const clientGameData: ClientGameData = {
      gameStarted: true,
      board: room.gameData.board.getClientBoard(),
      looseColor: room.gameData.board.loserColor,
      defeatedFigures: room.gameData.board.defeatedFigures,
      currentPlayerId: room.gameData.currentPlayerId,
      lastMove: { from, to },
      timers: room.gameData.timers,
    };

    if (room.gameData.board.loserColor !== null) {
      const winnerUserId = Object.values(room.players).find(
        x => x.color === room.gameData!.board.loserColor,
      )!.userId;
      return gameOver(io, roomId, winnerUserId);
    }

    io.to(roomId).emit(SocketEvent.Update, clientGameData);
  }
};
