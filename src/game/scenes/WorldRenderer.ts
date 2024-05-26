import { app } from "../../Pixi";
import { dispatch } from "../../store";
import { IWorldScene } from "../../store/types";
import { getCountryFromId } from "../../store/world";
import { CellType, DeepReadonly, IPosition } from "../../types";
import { Cell } from "../components/Cell";
import { ISceneRenderer } from "../types";
import { addHoverStyling } from "../utils/addHoverStyling";

export class WorldRenderer implements ISceneRenderer<IWorldScene> {
  constructor() {}

  public render(scene: DeepReadonly<IWorldScene>) {
    const canBeMergedCells = this.getCellsThatCanMerge(scene);

    // Draw map
    scene.cells.forEach((rowOfCells, row) => {
      rowOfCells.forEach((cellType, column) => {
        const cellInfo = scene.cellsInfo[cellType as CellType];
        const position = { x: column, y: row };
        if (!cellInfo || !cellInfo.cellColor) {
          return;
        }
        const shouldRenderMergedCell = canBeMergedCells.some(
          (position) => position.x === column && position.y === row
        );
        const wasCurrentCellMerged = canBeMergedCells.some(
          (position) =>
            (position.x === column - 1 && position.y === row - 1) ||
            (position.x === column && position.y === row - 1) ||
            (position.x === column - 1 && position.y === row)
        );
        if (wasCurrentCellMerged) {
          return;
        }
        const cell = new Cell(
          position,
          cellInfo.cellColor,
          scene.cells,
          scene.cellsInfo,
          shouldRenderMergedCell
        );
        app.stage.addChild(cell.element);

        // if that cell is interactive, add a click event
        if (cellInfo.isInteractive) {
          this.addCellInteractivity(cell, cellType);
          return;
        }
      });
    });
    console.log(app.stage.children.length);
  }

  private addCellInteractivity(cell: Cell, cellType: CellType) {
    const countryId = cellType;
    const countryName = getCountryFromId(countryId);
    addHoverStyling(cell.element);
    cell.element.on("click", (e) => {
      dispatch("createDialog", {
        title: countryName,
        position: e.client,
        content: [
          {
            kind: "button",
            text: "Buy port",
            onClick: () => {
              // buy and then visit the port
              dispatch("buyPort", { portName: countryName }).then(() => {
                dispatch("visitPort", { portName: countryName });
              });
            },
            closeOnClick: true,
          },
          {
            kind: "button",
            text: "Visit port",
            onClick: () => {
              dispatch("visitPort", { portName: countryName });
            },
            closeOnClick: true,
          },
        ],
      });
    });
  }

  // To improve performances, merge 4 cells into one
  private getCellsThatCanMerge(scene: DeepReadonly<IWorldScene>): IPosition[] {
    const canBeMergedCells: IPosition[] = [];

    for (let row = 0; row < scene.cells.length; row += 2) {
      for (let column = 0; column < scene.cells[row].length; column += 2) {
        const topLeftCell = scene.cells[row][column];
        const topRightCell = scene.cells[row][column + 1];
        const bottomLeftCell =
          scene.cells[row + 1] && scene.cells[row + 1][column];
        const bottomRightCell =
          scene.cells[row + 1] && scene.cells[row + 1][column + 1];

        if (
          topLeftCell === topRightCell &&
          topRightCell === bottomLeftCell &&
          bottomLeftCell === bottomRightCell
        ) {
          canBeMergedCells.push({ x: column, y: row });
        }
      }
    }
    return canBeMergedCells;
  }
}
