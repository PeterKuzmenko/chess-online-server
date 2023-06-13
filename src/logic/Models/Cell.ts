import { Figure } from './figures';
import { Colors } from '../types';

export class Cell {
  readonly x: number;
  readonly y: number;
  figure: Figure | null;

  constructor(x: number, y: number, figure: Figure | null) {
    this.x = x;
    this.y = y;
    this.figure = figure;
  }

  getPosition() {
    return { x: this.x, y: this.y };
  }

  isEmpty(): boolean {
    return this.figure === null;
  }

  isEnemy(color?: Colors): boolean {
    if (color === undefined) return false;

    return !this.isEmpty() && this.figure?.color !== color;
  }

  setFigure(figure: Figure) {
    this.figure = figure;
    this.figure.cell = this;
  }
}
