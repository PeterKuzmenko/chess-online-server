import { Colors, GameData } from '../../logic/types';

type Player = {
  userId: string;
  socketId: string;
  color?: Colors;
};

export type Room = {
  id: string;
  name: string;
  password?: string;
  players: Record<string, Player>;
  gameData?: GameData;
  gameOverTimerId?: NodeJS.Timeout;
};
