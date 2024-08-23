import { Graphics } from "pixi.js";
import { IPosition } from "../../types";
import { CELL_SIZE } from "../constants";
import { Isometry } from "../utils/isometry";

export class Cell {
  public element: Graphics;

  constructor(pos: IPosition, color: string, size: number = CELL_SIZE) {
    this.element = new Graphics();

    const screenPos = Isometry.gridPosToIsometricScreenPos(pos, size);
    this.element.position.set(screenPos.x, screenPos.y);

    this.element.svg(Isometry.createCube(size, color));
  }
}
