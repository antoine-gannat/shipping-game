import { app } from "../../Pixi";
import { dispatch } from "../../store";
import { IWorldScene } from "../../store/types";
import { getCountryFromId } from "../../store/world";
import { CellType, DeepReadonly } from "../../types";
import { Cell } from "../components/Cell";
import { ISceneRenderer } from "../types";
import { addHoverStyling } from "../utils/addHoverStyling";

export class WorldRenderer implements ISceneRenderer<IWorldScene> {
  constructor() {}

  public render(scene: DeepReadonly<IWorldScene>) {
    // Draw map
    scene.cells.forEach((rowOfCells, row) => {
      rowOfCells.forEach((cellType, column) => {
        const cellInfo = scene.cellsInfo[cellType as CellType];
        const position = { x: column, y: row };
        if (!cellInfo || !cellInfo.cellColor) {
          return;
        }
        const cell = new Cell(
          position,
          cellInfo.cellColor,
          scene.cells,
          scene.cellsInfo
        );
        app.stage.addChild(cell.element);

        // if that cell is interactive, add a click event
        if (cellInfo.isInteractive) {
          this.addCellInteractivity(cell, cellType);
          return;
        }
      });
    });
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
}
