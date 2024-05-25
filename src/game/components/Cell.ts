import { Container, Graphics } from "pixi.js";
import { CellType, DeepReadonly, ICellInfo, IPosition } from "../../types";
import { CELL_SIZE, MAGIC_X_POSITION_MULTIPLIER } from "../constants";
import { shadeColor } from "../utils/shadeColor";
import { degToRad } from "../utils/degrees";
import { cellPositionToScreenPosition } from "../utils/cellPosition";

export class Cell {
  public element: Container;
  public bounds: {
    top: IPosition;
    left: IPosition;
    right: IPosition;
    bottom: IPosition;
  };

  constructor(
    position: IPosition,
    color: string,
    // used to calculate neighbors
    cells: DeepReadonly<CellType[][]>,
    cellsInfo: DeepReadonly<Record<CellType, ICellInfo>>
  ) {
    this.element = new Container();
    // calculate if the cell has neighbors, if not, we'll render the sides

    // We concider the cell has a neighbor if said cell has a color
    const hasLeftNeighbor =
      !!cellsInfo[cells[position.y + 1]?.[position.x]]?.cellColor;
    const hasRightNeighbor =
      !!cellsInfo[[position.y]?.[position.x + 1]]?.cellColor;

    const topSide = new Graphics();
    const height = CELL_SIZE / 2;
    const sidePosition = { x: 0, y: CELL_SIZE / 2 };

    topSide.beginFill(color);
    topSide.drawRect(0, 0, CELL_SIZE, CELL_SIZE);
    topSide.endFill();
    topSide.position = sidePosition;
    topSide.skew = {
      x: degToRad(60 /* degrees */),
      y: -degToRad(30 /* degrees */),
    };

    let leftSide: Graphics;
    if (!hasLeftNeighbor) {
      leftSide = new Graphics();

      leftSide.beginFill(shadeColor(color, -20));
      leftSide.drawRect(0, 0, height, CELL_SIZE);
      leftSide.endFill();
      leftSide.position = sidePosition;
      leftSide.skew = {
        x: degToRad(60 /* degrees */),
        y: degToRad(90 /* degrees */),
      };
    }

    let rightSide: Graphics;
    if (!hasRightNeighbor) {
      rightSide = new Graphics();
      rightSide.beginFill(shadeColor(color, -30));
      rightSide.drawRect(0, 0, CELL_SIZE, height);
      rightSide.endFill();
      rightSide.position = {
        x: CELL_SIZE * MAGIC_X_POSITION_MULTIPLIER,
        y: CELL_SIZE,
      };
      rightSide.skew = { x: 0, y: -degToRad(30 /* degrees */) };
    }

    const { x, y } = cellPositionToScreenPosition(position);
    this.element.position.set(x, y);

    leftSide && this.element.addChild(leftSide);
    rightSide && this.element.addChild(rightSide);
    this.element.addChild(topSide);
  }
}
