export type StandardRoomArgs = {
  roomId: string;
  userId: string;
};

export enum SocketEvent {
  Update = 'update',
  RoomInfo = 'room info',
  Step = 'step',
  JoinRoom = 'join room',
  JoinRoomWrongPassword = 'wrong password',
  GameOver = 'game over',
  RoomDoesNotExist = 'room does not exist',
}
