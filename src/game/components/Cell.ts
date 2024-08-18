import { Graphics } from "pixi.js";
import { IPosition } from "../../types";
import { CELL_SIZE } from "../constants";
import { shadeColor } from "../utils/shadeColor";

const svgCache: Record<string, string> = {};

export class Cell {
  public element: Graphics;

  constructor(pos: IPosition, color: string, size: number = CELL_SIZE) {
    this.element = new Graphics();

    this.element.position.set(
      (size / 2) * pos.x - (size / 2) * pos.y,
      pos.x * (size / 4) + pos.y * (size / 4)
    );

    // prettier-ignore
    this.element.svg(this.createSvg(size, color));
  }
  private createSvg(size: number, color: string) {
    const cacheKey = `${size}-${color}`;
    if (svgCache[cacheKey]) return svgCache[cacheKey];
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

    const newSvg = `
      <svg width="${size}" height="${size}">
        <-- topSide -->
        <path d="M ${pts.x1} ${pts.y1} L ${pts.x2} ${pts.y2} L ${pts.x3} ${
      pts.y3
    } L ${pts.x4} ${pts.y4}" fill="${topColor}" stroke="${topColor}" />
        <-- leftSide -->
        <path d="M ${pts.x4} ${pts.y4} L ${pts.x4} ${pts.y4 + size / 2} L ${
      pts.x1
    } ${pts.y3 + size / 2} L ${pts.x3} ${
      pts.y3
    }" fill="${leftColor}" stroke="${leftColor}" />
        <-- rightSide -->
        <path d="M ${pts.x2} ${pts.y2} L ${pts.x2} ${pts.y2 + size / 2} L ${
      pts.x1
    } ${pts.y3 + size / 2} L ${pts.x3} ${
      pts.y3
    }" fill="${rightColor}" stroke="${rightColor}" />
      </svg>
     `;

    svgCache[cacheKey] = newSvg;
    return newSvg;
  }
  public static createPaths(pos: { x: number; y: number }) {
    const color = "#FFFFFF";
    const size = CELL_SIZE;

    const newPos = {
      x: (size / 2) * pos.x - (size / 2) * pos.y,
      y: pos.x * (size / 4) + pos.y * (size / 4),
    };
    const pts = {
      x1: size / 2 + newPos.x,
      y1: 0 + newPos.y,
      x2: size + newPos.x,
      y2: size / 4 + newPos.y,
      x3: size / 2 + newPos.x,
      y3: size / 2 + newPos.y,
      x4: 0 + newPos.x,
      y4: size / 4 + newPos.y,
    };

    const topColor = color;
    const leftColor = shadeColor(color, -20);
    const rightColor = shadeColor(color, -30);

    return `
    <path d="M ${pts.x1} ${pts.y1} L ${pts.x2} ${pts.y2} L ${pts.x3} ${
      pts.y3
    } L ${pts.x4} ${pts.y4}" fill="${topColor}" stroke="${topColor}" />
    <path d="M ${pts.x4} ${pts.y4} L ${pts.x4} ${pts.y4 + size / 2} L ${
      pts.x1
    } ${pts.y3 + size / 2} L ${pts.x3} ${
      pts.y3
    }" fill="${leftColor}" stroke="${leftColor}" />
    
    <path d="M ${pts.x2} ${pts.y2} L ${pts.x2} ${pts.y2 + size / 2} L ${
      pts.x1
    } ${pts.y3 + size / 2} L ${pts.x3} ${
      pts.y3
    }" fill="${rightColor}" stroke="${rightColor}" />
     `
      .replaceAll("\n", "")
      .replaceAll("  ", "");
  }
}
