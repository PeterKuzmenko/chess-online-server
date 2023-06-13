import { Colors, Figures } from '../../types';
import { Cell } from '../Cell';
import { Figure } from './Figure';
import { Board } from '../Board';

export class Horse extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell, Figures.Horse);
  }

  calculatePossibleSteps(board: Board) {
    const { x, y } = this.cell.getPosition();

    this.addIfStepPossible(board, { x: x - 1, y: y + 2 });
    this.addIfStepPossible(board, { x: x + 1, y: y + 2 });
    this.addIfStepPossible(board, { x: x + 2, y: y + 1 });
    this.addIfStepPossible(board, { x: x + 2, y: y - 1 });
    this.addIfStepPossible(board, { x: x - 1, y: y - 2 });
    this.addIfStepPossible(board, { x: x + 1, y: y - 2 });
    this.addIfStepPossible(board, { x: x - 2, y: y - 1 });
    this.addIfStepPossible(board, { x: x - 2, y: y + 1 });
  }
}
