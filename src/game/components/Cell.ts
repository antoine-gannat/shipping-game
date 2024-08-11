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
    pos: IPosition,
    color: string,
    // used to calculate neighbors
    cells: DeepReadonly<CellType[][]>,
    cellsInfo: DeepReadonly<Record<CellType, ICellInfo>>,
    doubleSize = false
  ) {
    const position = doubleSize ? { x: pos.x, y: pos.y + 1 } : pos;
    const size = doubleSize ? CELL_SIZE * 2 : CELL_SIZE;
    this.element = new Container();
    // calculate if the cell has neighbors, if not, we'll render the sides

    // We concider the cell has a neighbor if said cell has a color
    const hasLeftNeighbor =
      !!cellsInfo[cells[position.y + 1]?.[position.x]]?.cellColor;
    const hasRightNeighbor =
      !!cellsInfo[cells[position.y]?.[position.x + 1]]?.cellColor;

    const topSide = new Graphics();
    const height = CELL_SIZE / 2;
    const sidePosition = { x: 0, y: CELL_SIZE / 2 };

    topSide.rect(0, 0, size, size);
    topSide.fill({ color });
    topSide.position = sidePosition;
    topSide.skew = {
      x: degToRad(60 /* degrees */),
      y: -degToRad(30 /* degrees */),
    };

    let leftSide: Graphics;
    if (!hasLeftNeighbor || doubleSize) {
      leftSide = new Graphics();

      leftSide.rect(0, 0, height, size);
      leftSide.fill({ color: shadeColor(color, -20) });
      leftSide.position = sidePosition;
      leftSide.skew = {
        x: degToRad(60 /* degrees */),
        y: degToRad(90 /* degrees */),
      };
    }

    let rightSide: Graphics;
    if (!hasRightNeighbor || doubleSize) {
      rightSide = new Graphics();
      rightSide.rect(0, 0, size, height);
      rightSide.fill({ color: shadeColor(color, -30) });
      rightSide.position = {
        x: size * MAGIC_X_POSITION_MULTIPLIER, // TODO: magic number
        y: doubleSize ? size - CELL_SIZE / 2 : size,
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
