import { Colors, Figures } from '../../types';
import { Cell } from '../Cell';
import { Figure } from './Figure';
import { Board } from '../Board';

export class Pawn extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell, Figures.Pawn);
  }

  isFirstStep() {
    const y = this.cell.y;
    const color = this.color;

    return (color === Colors.White && y === 6) || (color === Colors.Black && y === 1);
  }

  calculatePossibleSteps(board: Board) {
    const { x, y } = this.cell.getPosition();

    const possibleStepsForward = this.isFirstStep() ? 2 : 1;
    const direction = this.color === Colors.White ? -1 : 1;

    for (let i = 0; i < possibleStepsForward; i++) {
      this.addAndDoActionIfNotEmpty(
        board,
        { x, y: y + (i + 1) * direction },
        () => (i = 10),
        true,
        false,
      );
    }

    this.addIfStepPossible(board, { x: x + 1, y: y + 1 * direction }, false, true);
    this.addIfStepPossible(board, { x: x - 1, y: y + 1 * direction }, false, true);

    const enPassantYPosition = this.color === Colors.White ? 3 : 4;

    if (y === enPassantYPosition) {
      if (board.getCell(x - 1, y)?.figure?.enPassantPossible) {
        this.addIfStepPossible(board, { x: x - 1, y: y + direction }, true, false);
      }
      if (board.getCell(x + 1, y)?.figure?.enPassantPossible) {
        this.addIfStepPossible(board, { x: x + 1, y: y + direction }, true, false);
      }
    }
  }
}
