import { Colors, Figures } from '../../types';
import { Cell } from '../Cell';
import { Figure } from './Figure';
import { Board } from '../Board';

export class Bishop extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell, Figures.Bishop);
  }

  calculatePossibleSteps(board: Board) {
    this.calculatePossibleStepsForBishop(board);
  }
}
