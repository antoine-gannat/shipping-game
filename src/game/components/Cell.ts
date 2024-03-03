import { Container, Graphics } from "pixi.js";
import { IPosition } from "../types";
import { CELL_SIZE } from "../constants";
import { shadeColor } from "../utils/shadeColor";

export class Cell {
  public element: Container;

  constructor(position: IPosition, color: string) {
    this.element = new Container();

    var topSide = new Graphics();
    const height = CELL_SIZE / 2;

    topSide.beginFill(color);
    topSide.drawRect(0, 0, CELL_SIZE, CELL_SIZE);
    topSide.endFill();
    topSide.setTransform(
      /* x */ 0,
      /* y */ 0 + CELL_SIZE * 0.5,
      /* scaleX */ 1,
      /* scaley */ 1,
      /* rotation */ 0,
      /* skewX */ 1.1,
      /* skewY */ -0.5,
      /* pivotX */ 0,
      /* pivotY */ 0
    );

    var leftSide = new Graphics();

    leftSide.beginFill(shadeColor(color, -20));
    leftSide.drawRect(0, 0, height, CELL_SIZE);
    leftSide.endFill();
    leftSide.setTransform(0, 0 + CELL_SIZE * 0.5, 1, 1, 0, 1.1, 1.57, 0, 0);

    var rightSide = new Graphics();

    rightSide.beginFill(shadeColor(color, -30));
    rightSide.drawRect(0, 0, CELL_SIZE, height);
    rightSide.endFill();
    rightSide.setTransform(
      0,
      0 + CELL_SIZE * 0.5,
      1,
      1,
      0,
      -0.0,
      -0.5,
      -(CELL_SIZE + CELL_SIZE * 0.015),
      -(CELL_SIZE - CELL_SIZE * 0.06)
    );

    this.element.position.set(position.x, position.y);

    this.element.addChild(leftSide);
    this.element.addChild(rightSide);
    this.element.addChild(topSide);
  }
}
