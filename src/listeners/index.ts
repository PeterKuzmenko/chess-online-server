import { Server, Socket } from 'socket.io';
import { curry } from 'ramda';
import { onJoinRoom } from './joinRoom';
import { onStepAction } from './stepAction';
import { SocketEvent } from './types';

type HandleListener = (socket: Socket, io: Server, args: any) => void;

const handleListenerCurried = curry((socket: Socket, io: Server, cb: HandleListener, args) =>
  cb(socket, io, args),
);

export const setListeners = (socket: Socket, io: Server) => {
  const handleListenerWrap = handleListenerCurried(socket, io);

  socket.on(SocketEvent.JoinRoom, handleListenerWrap(onJoinRoom));
  socket.on(SocketEvent.Step, handleListenerWrap(onStepAction));
};
