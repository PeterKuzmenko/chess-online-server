import { Colors, Figures } from '../../types';
import { Cell } from '../Cell';
import { Figure } from './Figure';
import { Board } from '../Board';

export class Queen extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell, Figures.Queen);
  }

  calculatePossibleSteps(board: Board) {
    this.calculatePossibleStepsForRook(board);
    this.calculatePossibleStepsForBishop(board);
  }
}
