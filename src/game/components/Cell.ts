import { Graphics } from "pixi.js";
import { IPosition } from "../../types";
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

  constructor(pos: IPosition, color: string, size: number = CELL_SIZE) {
    this.element = new Graphics();

    this.element.position.set(
      (size / 2) * pos.x - (size / 2) * pos.y,
      pos.x * (size / 4) + pos.y * (size / 4)
    );
    const pts = {
      x1: size / 2,
      y1: 0,
      x2: size,
      y2: size / 4,
      x3: size / 2,
      y3: size / 2,
      x4: 0,
      y4: size / 4,
    };

    const topColor = color;
    const leftColor = shadeColor(color, -20);
    const rightColor = shadeColor(color, -30);

    // prettier-ignore
    this.element.svg(`
      <svg width="${size}" height="${size}">
        <-- topSide -->
        <path d="M ${pts.x1} ${pts.y1} L ${pts.x2} ${pts.y2} L ${pts.x3} ${pts.y3} L ${pts.x4} ${pts.y4}" fill="${topColor}" stroke="${topColor}" />
        <-- leftSide -->
        <path d="M ${pts.x4} ${pts.y4} L ${pts.x4} ${pts.y4 + size / 2} L ${pts.x1} ${pts.y3 + size/2} L ${pts.x3} ${pts.y3}" fill="${leftColor}" stroke="${leftColor}" />
        <-- rightSide -->
        <path d="M ${pts.x2} ${pts.y2} L ${pts.x2} ${pts.y2 + size / 2} L ${pts.x1} ${pts.y3 + size/2} L ${pts.x3} ${pts.y3}" fill="${rightColor}" stroke="${rightColor}" />
      </svg>
     `);
  }
}
