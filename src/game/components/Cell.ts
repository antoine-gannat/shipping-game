import { Graphics } from "pixi.js";
import { IPosition } from "../../types";
import { CELL_SIZE } from "../constants";
import { Isometry } from "../utils/isometry";

export class Cell {
  public element: Graphics;

  constructor(pos: IPosition, color: string) {
    this.element = new Graphics();

    const size = { width: CELL_SIZE, height: CELL_SIZE / 4 };

    const screenPos = Isometry.gridPosToIsometricScreenPos(pos, size);
    this.element.position.set(screenPos.x, screenPos.y);

    this.element.svg(Isometry.createCube(size, color));
  }
}
