import { Board as BoardC } from './Models';

export enum Figures {
  Pawn,
  Horse,
  Rook,
  Bishop,
  Queen,
  King,
}

export type PawnCanBeTurnInto = Figures.Horse | Figures.Rook | Figures.Bishop | Figures.Queen;

export enum Colors {
  White,
  Black,
}

export type Position = {
  x: number;
  y: number;
};

export type Figure = {
  type: Figures;
  possibleSteps?: Position[];
  color: Colors;
};

export type Board = (Figure | null)[][];

export type GameData = {
  board: BoardC;
  currentPlayerId?: string;
  timers?: Record<string, number>;
  previousStepTime?: number;
  gameStarted?: boolean;
};

export type ClientCell = {
  possibleSteps: Position[];
  type: Figures;
  color: Colors;
} | null;

export type ClientGameData = Pick<GameData, 'currentPlayerId'> & {
  board: ClientCell[][];
  looseColor: Colors | null;
  defeatedFigures: Record<Colors, Figures[]>;
  lastMove?: { from: Position; to: Position };
  timers?: Record<string, number>;
  gameStarted: boolean;
};

export type IsCastlingPossibleInDirections = {
  left: boolean;
  right: boolean;
};
