import { Container, Graphics } from "pixi.js";
import { IPosition } from "../types";
import { CELL_SIZE } from "../constants";

function shadeColor(color: string, percent: number) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = (R * (100 + percent)) / 100;
  G = (G * (100 + percent)) / 100;
  B = (B * (100 + percent)) / 100;

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  const RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
  const GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
  const BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

  return "#" + RR + GG + BB;
}

export class Cell {
  public element: Container;

  constructor(position: IPosition, color: string) {
    this.element = new Container();

    var topSide = new Graphics();
    const height = CELL_SIZE / 2;

    topSide.beginFill(color);
    topSide.drawRect(0, 0, CELL_SIZE, CELL_SIZE);
    topSide.endFill();
    topSide.setTransform(0, 0 + CELL_SIZE * 0.5, 1, 1, 0, 1.1, -0.5, 0, 0);

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
