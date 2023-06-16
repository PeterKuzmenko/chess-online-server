import { Server, Socket } from 'socket.io';
import { rooms } from '../../routes/rooms';
import { ClientGameData, Colors } from '../../logic/types';
import { SocketEvent, StandardRoomArgs } from '../types';
import { Board } from '../../logic/Models';
import { JwtPayload } from 'jsonwebtoken';
import { updateTimers } from '../helpers';

interface CustomSocket extends Socket {
  decoded?: string | JwtPayload;
}

type JoinRoomArgs = StandardRoomArgs & {
  password?: string;
};

const tenMinutesInMs = 600000;
const startPlayerTimer = tenMinutesInMs;

export const onJoinRoom = (
  socket: CustomSocket,
  io: Server,
  { roomId, password }: JoinRoomArgs,
) => {
  const userId = socket.userId;
  const room = rooms[roomId];

  if (!userId) return;
  if (!room) {
    return socket.emit(SocketEvent.RoomDoesNotExist);
  }

  if (room.password && room.password !== password) {
    socket.emit(SocketEvent.JoinRoomWrongPassword);
    return;
  }

  const alreadyInRoom = Object.keys(room.players).find(x => x === userId);

  socket.join(roomId);
  if (!alreadyInRoom) {
    room.players[userId] = {
      socketId: socket.id,
      userId,
    };
  }

  if (Object.keys(room.players).length === 2) {
    if (!alreadyInRoom) {
      const timers = Object.keys(room.players).reduce(
        (acc, x) => ({ ...acc, [x]: startPlayerTimer }),
        {},
      );
      room.gameData = { board: new Board(), timers };

      const currentPlayerId = Object.keys(room.players)[Math.round(Math.random())];
      room.gameData.currentPlayerId = currentPlayerId;

      Object.keys(room.players).forEach(x => {
        room.players[x].color = x === currentPlayerId ? Colors.White : Colors.Black;
      });
    } else if (room.gameData?.gameStarted) {
      updateTimers(room.gameData!);
    }

    const clientGameData: ClientGameData = {
      gameStarted: !!room.gameData!.gameStarted,
      board: room.gameData!.board.getClientBoard(),
      looseColor: room.gameData!.board.loserColor,
      defeatedFigures: room.gameData!.board.defeatedFigures,
      timers: room.gameData!.timers,
      currentPlayerId: room?.gameData?.currentPlayerId,
    };
    const roomInfo = {
      playersColors: Object.values(room.players).reduce(
        (acc, x) => ({ ...acc, [x.userId]: x.color }),
        {},
      ),
    };

    if (alreadyInRoom) {
      socket.emit(SocketEvent.RoomInfo, roomInfo);
      socket.emit(SocketEvent.Update, clientGameData);
    } else {
      io.to(roomId).emit(SocketEvent.RoomInfo, roomInfo);
      io.to(roomId).emit(SocketEvent.Update, clientGameData);
    }
  }
};
