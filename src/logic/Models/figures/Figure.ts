import { Colors, Figures } from '../../types';
import { Cell } from '../Cell';
import { Board } from '../Board';

export class Figure {
  color: Colors;
  possibleSteps: Cell[];
  cell: Cell;
  type: Figures;
  enPassantPossible: boolean = false;

  constructor(color: Colors, cell: Cell, type: Figures) {
    this.color = color;
    this.cell = cell;
    this.cell.figure = this;
    this.possibleSteps = [];
    this.type = type;
  }

  calculatePossibleSteps(board: Board) {}

  clearPossibleSteps() {
    this.possibleSteps = [];
  }

  addIfStepPossible(
    board: Board,
    { x, y }: { x: number; y: number },
    addOnEmpty = true,
    addIfPossibleAttack = true,
  ) {
    const possibleStepCell = board.getCell(x, y);

    if (
      (addOnEmpty && possibleStepCell?.isEmpty()) ||
      (addIfPossibleAttack && possibleStepCell?.isEnemy(this.cell.figure?.color))
    ) {
      const from = { x: this.cell.x, y: this.cell.y };
      const to = { x, y };

      if (board.isCopied || !board.doesMoveCauseMate(from, to)) {
        this.possibleSteps.push(possibleStepCell);
      }
    }
  }

  addAndDoActionIfNotEmpty(
    board: Board,
    { x, y }: { x: number; y: number },
    action: () => void,
    addOnEmpty?: boolean,
    addIfPossibleAttack?: boolean,
  ) {
    this.addIfStepPossible(board, { x, y }, addOnEmpty, addIfPossibleAttack);

    if (!board.getCell(x, y)?.isEmpty()) action();
  }

  calculatePossibleStepsForBishop(board: Board) {
    const { x, y } = this.cell.getPosition();

    let moreRightTop = true;
    let moreRightBottom = true;
    let moreLeftTop = true;
    let moreLeftBottom = true;

    for (let i = 1; i < 8; i++) {
      if (moreRightTop) {
        this.addAndDoActionIfNotEmpty(board, { x: x + i, y: y - i }, () => (moreRightTop = false));
      }

      if (moreRightBottom) {
        this.addAndDoActionIfNotEmpty(
          board,
          {
            x: x + i,
            y: y + i,
          },
          () => (moreRightBottom = false),
        );
      }

      if (moreLeftTop) {
        this.addAndDoActionIfNotEmpty(board, { x: x - i, y: y - i }, () => (moreLeftTop = false));
      }

      if (moreLeftBottom) {
        this.addAndDoActionIfNotEmpty(
          board,
          { x: x - i, y: y + i },
          () => (moreLeftBottom = false),
        );
      }
    }
  }

  calculatePossibleStepsForRook(board: Board) {
    const { x, y } = this.cell.getPosition();

    let moreTop = true;
    let moreBottom = true;
    let moreLeft = true;
    let moreRight = true;

    for (let i = 1; i < 8; i++) {
      if (moreTop) {
        this.addAndDoActionIfNotEmpty(board, { x, y: y - i }, () => (moreTop = false));
      }

      if (moreBottom) {
        this.addAndDoActionIfNotEmpty(board, { x, y: y + i }, () => (moreBottom = false));
      }

      if (moreLeft) {
        this.addAndDoActionIfNotEmpty(board, { x: x - i, y }, () => (moreLeft = false));
      }

      if (moreRight) {
        this.addAndDoActionIfNotEmpty(board, { x: x + i, y }, () => (moreRight = false));
      }
    }
  }

  forEachPossibleStep(board: Board, cb: (cell: Cell) => void) {
    this.possibleSteps.forEach(({ x, y }) => {
      const cell = board.getCell(x, y);
      cb(cell);
    });
  }
}
