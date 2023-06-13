import { Board, Position, Colors } from '../types';

export const checkIsInBorders = ({ x, y }: Position) => x >= 0 && x < 8 && y >= 0 && y < 8;

export const checkIsEmpty = (board: Board, { x, y }: Position) => {
  return checkIsInBorders({ x, y }) && !board[y][x];
};

export const addIfItPossibleStep = (
  possibleSteps: Position[],
  board: Board,
  cell: Position,
  color = Colors.White,
  onEmpty = true,
) => {
  const { x, y } = cell;

  if (!checkIsInBorders(cell)) return;

  if (
    (onEmpty && checkIsEmpty(board, cell)) ||
    (board[y][x]?.color && board[y][x]?.color !== color)
  ) {
    possibleSteps.push(cell);
  }
};

export const forEachCell = (cb: (cell: Position) => boolean | void) => {
  for (let y = 0; y <= 7; y++) {
    for (let x = 0; x <= 7; x++) {
      if (cb({ y, x })) return;
    }
  }
};
