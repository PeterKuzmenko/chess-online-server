import { Colors, Figures } from '../../types';
import { Cell } from '../Cell';
import { Figure } from './Figure';
import { Board } from '../Board';

export class King extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell, Figures.King);
  }

  calculatePossibleSteps(board: Board) {
    const { x, y } = this.cell.getPosition();

    this.addIfStepPossible(board, { x: x - 1, y: y - 1 });
    this.addIfStepPossible(board, { x, y: y - 1 });
    this.addIfStepPossible(board, { x: x + 1, y: y - 1 });
    this.addIfStepPossible(board, { x: x + 1, y });
    this.addIfStepPossible(board, { x: x + 1, y: y + 1 });
    this.addIfStepPossible(board, { x, y: y + 1 });
    this.addIfStepPossible(board, { x: x - 1, y: y + 1 });
    this.addIfStepPossible(board, { x: x - 1, y });

    this.addStepsIfCastlingPossible(board);
  }

  addStepsIfCastlingPossible(board: Board) {
    const color = this.color;
    const nearestBorder = color === Colors.White ? 7 : 0;

    if (
      board.isCastlingPossible?.[color].left &&
      board.getCell(1, nearestBorder)?.isEmpty() &&
      board.getCell(2, nearestBorder)?.isEmpty() &&
      board.getCell(3, nearestBorder)?.isEmpty()
    ) {
      this.addIfStepPossible(board, { x: 2, y: nearestBorder });
    }

    if (
      board.isCastlingPossible?.[color].right &&
      board.getCell(5, nearestBorder)?.isEmpty() &&
      board.getCell(6, nearestBorder)?.isEmpty()
    ) {
      this.addIfStepPossible(board, { x: 6, y: nearestBorder });
    }
  }
}
