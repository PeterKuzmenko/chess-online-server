import {
  ClientCell,
  Colors,
  Figures,
  IsCastlingPossibleInDirections,
  PawnCanBeTurnInto,
  Position,
} from '../types';
import { forEachCell } from './helpers';
import { Cell } from './Cell';
import { Bishop, Horse, King, Pawn, Queen, Rook } from './figures';
import { clone } from 'ramda';

const pawnTurnIntoModelMap = {
  [Figures.Queen]: Queen,
  [Figures.Bishop]: Bishop,
  [Figures.Horse]: Horse,
  [Figures.Rook]: Rook,
};

const getEmptyBoardCells = () => new Array(8).fill(null).map(() => new Array(8).fill(null));

export class Board {
  cells: Cell[][] = getEmptyBoardCells();
  isCastlingPossible: Record<Colors, IsCastlingPossibleInDirections> = {
    [Colors.White]: {
      left: true,
      right: true,
    },
    [Colors.Black]: {
      left: true,
      right: true,
    },
  };
  defeatedFigures: Record<Colors, Figures[]> = {
    [Colors.White]: [],
    [Colors.Black]: [],
  };
  currentPlayerColor: Colors = Colors.White;
  isCopied: boolean;
  loserColor: Colors | null = null;

  constructor(isCopied: boolean = false) {
    this.isCopied = isCopied;

    this.initCells();
    this.addFigures();
    this.calculateSteps();
  }

  getClientBoard(): ClientCell[][] {
    const clientBoard = getEmptyBoardCells();

    forEachCell(({ x, y }) => {
      const cell = this.cells[y][x];

      if (!cell.figure) {
        clientBoard[y][x] = null;
        return;
      }

      const { type, color, possibleSteps } = cell.figure;

      clientBoard[y][x] = {
        type,
        color,
        possibleSteps: possibleSteps.map(({ x, y }) => ({ x, y })),
      };
    });

    return clientBoard;
  }

  initCells() {
    forEachCell(({ x, y }) => {
      this.cells[y][x] = new Cell(x, y, null);
    });
  }

  getCell(x: number, y: number) {
    return this.cells?.[y]?.[x];
  }

  private addPawns() {
    for (let i = 0; i < 8; i++) {
      new Pawn(Colors.Black, this.getCell(i, 1));
      new Pawn(Colors.White, this.getCell(i, 6));
    }
  }

  private addKings() {
    new King(Colors.Black, this.getCell(4, 0));
    new King(Colors.White, this.getCell(4, 7));
  }

  private addQueens() {
    new Queen(Colors.Black, this.getCell(3, 0));
    new Queen(Colors.White, this.getCell(3, 7));
  }

  private addBishops() {
    new Bishop(Colors.Black, this.getCell(2, 0));
    new Bishop(Colors.Black, this.getCell(5, 0));
    new Bishop(Colors.White, this.getCell(2, 7));
    new Bishop(Colors.White, this.getCell(5, 7));
  }

  private addKnights() {
    new Horse(Colors.Black, this.getCell(1, 0));
    new Horse(Colors.Black, this.getCell(6, 0));
    new Horse(Colors.White, this.getCell(1, 7));
    new Horse(Colors.White, this.getCell(6, 7));
  }

  private addRooks() {
    new Rook(Colors.Black, this.getCell(0, 0));
    new Rook(Colors.Black, this.getCell(7, 0));
    new Rook(Colors.White, this.getCell(0, 7));
    new Rook(Colors.White, this.getCell(7, 7));
  }

  private addFigures() {
    this.addPawns();
    this.addKnights();
    this.addKings();
    this.addBishops();
    this.addQueens();
    this.addRooks();
  }

  moveFigure(from: Position, to: Position, turnInto?: PawnCanBeTurnInto) {
    const fromCell = this.getCell(from.x, from.y);

    if (!this.isMovePossible(fromCell, to)) return;

    if (fromCell.figure) {
      const toCell = this.getCell(to.x, to.y);
      if (toCell?.figure) {
        this.defeatedFigures[toCell.figure.color].push(toCell.figure.type);
      }
      toCell?.setFigure(fromCell.figure);

      if (fromCell.figure.type === Figures.King) {
        this.checkCastlingMoves(to);
      }

      if (fromCell.figure.type === Figures.Pawn) {
        this.checkEnPassantMoves(from, to);
        this.checkPawnPromMoves(from, to, turnInto);
      }

      fromCell.figure = null;

      // change currentPlayerColor to opposite
      this.currentPlayerColor = [Colors.Black, Colors.White][this.currentPlayerColor];

      this.calculateSteps();
      return true;
    }
  }

  checkPawnPromMoves(from: Position, to: Position, turnInto?: PawnCanBeTurnInto) {
    const pawnPromCellY = this.currentPlayerColor === Colors.White ? 0 : 7;

    if (to.y === pawnPromCellY) {
      this.turnPawnIntoFigure(to, turnInto ?? Figures.Queen);
    }
  }

  turnPawnIntoFigure({ x, y }: Position, figureType: PawnCanBeTurnInto) {
    const Model = pawnTurnIntoModelMap[figureType];

    new Model(this.currentPlayerColor, this.getCell(x, y));
  }

  // for en passent
  checkEnPassantMoves(from: Position, to: Position) {
    const enPassantYPosition = this.currentPlayerColor ? 3 : 4;
    const pawnPassantCell = this.getCell(to.x, enPassantYPosition);
    const figure = this.getCell(to.x, to.y)?.figure;

    if (Math.abs(from.y - to.y) === 2 && figure) {
      figure.enPassantPossible = true;
    }

    if (
      from.y === enPassantYPosition &&
      to.x !== from.x &&
      pawnPassantCell?.figure?.type === Figures.Pawn
    ) {
      this.defeatedFigures[pawnPassantCell.figure.color].push(pawnPassantCell.figure.type);

      pawnPassantCell.figure = null;
    }
  }

  checkCastlingMoves(to: Position) {
    const isCastlingLeftMove = this.isCastlingPossible[this.currentPlayerColor].left && to.x === 2;
    const isCastlingRightMove =
      this.isCastlingPossible[this.currentPlayerColor].right && to.x === 6;

    if (isCastlingLeftMove) {
      const leftRookCell = this.getCell(0, to.y);
      if (leftRookCell?.figure) {
        this.getCell(3, to.y)?.setFigure(leftRookCell.figure);
        leftRookCell.figure = null;
      }
    }
    if (isCastlingRightMove) {
      const rightRookCell = this.getCell(7, to.y);
      if (rightRookCell?.figure) {
        this.getCell(5, to.y)?.setFigure(rightRookCell.figure);
        rightRookCell.figure = null;
      }
    }

    if (isCastlingLeftMove || isCastlingRightMove) {
      this.isCastlingPossible[this.currentPlayerColor].left = false;
      this.isCastlingPossible[this.currentPlayerColor].right = false;
    }
  }

  isMovePossible(fromCell: Cell, to: Position) {
    if (this.currentPlayerColor !== fromCell?.figure?.color) return false;

    let isPossible = false;

    fromCell?.figure?.forEachPossibleStep(this, possibleStepCell => {
      if (possibleStepCell.x === to.x && possibleStepCell.y === to.y) isPossible = true;
    });

    return isPossible;
  }

  calculateSteps() {
    let gameOver = true;
    // const start = performance.now();
    forEachCell(({ x, y }) => {
      const figure = this.getCell(x, y)?.figure;

      if (figure?.color === this.currentPlayerColor) {
        figure?.clearPossibleSteps();
        figure?.calculatePossibleSteps(this);

        if (figure.possibleSteps.length > 0) {
          gameOver = false;
        }
      } else {
        figure?.clearPossibleSteps();
      }
    });

    if (gameOver) {
      this.loserColor = this.currentPlayerColor;
    }
    // const end = performance.now();
    //
    // if (!this.isCopied) {
    //   console.log(`Execution time: ${end - start} ms`);
    // }
  }

  doesMoveCauseMate(from: Position, to: Position) {
    let result = false;
    const copyBoard = this.getCopyBoard();

    const fromCell = copyBoard.getCell(from.x, from.y);
    const toCell = copyBoard.getCell(to.x, to.y);

    if (toCell && fromCell?.figure) {
      toCell.setFigure(fromCell.figure);
      fromCell.figure = null;
    }

    forEachCell(({ x, y }) => {
      const cell = copyBoard.getCell(x, y);

      if (cell?.figure && cell?.figure?.color !== copyBoard.currentPlayerColor) {
        cell.figure.calculatePossibleSteps(copyBoard);

        result = !!cell.figure.possibleSteps.find(
          possibleStep =>
            possibleStep.figure?.color === copyBoard.currentPlayerColor &&
            possibleStep.figure?.type === Figures.King,
        );
        return result;
      }
    });

    return result;
  }

  public getCopyBoard(): Board {
    const newBoard = new Board(true);
    newBoard.cells = clone(this.cells);
    newBoard.currentPlayerColor = this.currentPlayerColor;

    return newBoard;
  }
}
