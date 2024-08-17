import { Graphics } from "pixi.js";
import { CellType, DeepReadonly, ICellInfo, IPosition } from "../../types";
import { CELL_SIZE } from "../constants";
import { shadeColor } from "../utils/shadeColor";

export class Cell {
  public element: Graphics;
  public bounds: {
    top: IPosition;
    left: IPosition;
    right: IPosition;
    bottom: IPosition;
  };

  constructor(
    pos: IPosition,
    color: string,
    // used to calculate neighbors
    _cells: DeepReadonly<CellType[][]>,
    _cellsInfo: DeepReadonly<Record<CellType, ICellInfo>>,
    _doubleSize = false
  ) {
    // const position = doubleSize ? { x: pos.x, y: pos.y + 1 } : pos;
    // const size = doubleSize ? CELL_SIZE * 2 : CELL_SIZE;
    this.element = new Graphics();

    this.element.position.set(
      (CELL_SIZE / 2) * pos.x - (CELL_SIZE / 2) * pos.y,
      pos.x * (CELL_SIZE / 4) + pos.y * (CELL_SIZE / 4)
    );
    const pts = {
      x1: CELL_SIZE / 2,
      y1: 0,
      x2: CELL_SIZE,
      y2: CELL_SIZE / 4,
      x3: CELL_SIZE / 2,
      y3: CELL_SIZE / 2,
      x4: 0,
      y4: CELL_SIZE / 4,
    };

    const topColor = color;
    const leftColor = shadeColor(color, -20);
    const rightColor = shadeColor(color, -30);

    // prettier-ignore
    this.element.svg(`
      <svg width="${CELL_SIZE}" height="${CELL_SIZE}">
        <-- topSide -->
        <path d="M ${pts.x1} ${pts.y1} L ${pts.x2} ${pts.y2} L ${pts.x3} ${pts.y3} L ${pts.x4} ${pts.y4}" fill="${topColor}" stroke="${topColor}" />
        <-- leftSide -->
        <path d="M ${pts.x4} ${pts.y4} L ${pts.x4} ${pts.y4 + CELL_SIZE / 2} L ${pts.x1} ${pts.y3 + CELL_SIZE/2} L ${pts.x3} ${pts.y3}" fill="${leftColor}" stroke="${leftColor}" />
        <-- rightSide -->
        <path d="M ${pts.x2} ${pts.y2} L ${pts.x2} ${pts.y2 + CELL_SIZE / 2} L ${pts.x1} ${pts.y3 + CELL_SIZE/2} L ${pts.x3} ${pts.y3}" fill="${rightColor}" stroke="${rightColor}" />
      </svg>
     `);
  }
}
