import { Graphics } from "pixi.js";
import { app } from "../../Pixi";
import { dispatch } from "../../store";
import { IWorldScene } from "../../store/types";
import { getCountryFromId, worldCellsPosition } from "../../store/world";
import { CellType, DeepReadonly } from "../../types";
import { Cell } from "../components/Cell";
import { ISceneRenderer } from "../types";
import { addHoverStyling } from "../utils/addHoverStyling";
import { Isometry } from "../utils/isometry";
import { CELL_SIZE } from "../constants";

export class WorldRenderer implements ISceneRenderer<IWorldScene> {
  public render(scene: DeepReadonly<IWorldScene>) {
    Object.keys(worldCellsPosition).forEach((cellType) => {
      const cellTypeNumber = Number(cellType);
      const cellInfo = scene.cellsInfo[cellTypeNumber];
      const paths = worldCellsPosition[
        cellType as keyof typeof worldCellsPosition
      ].map((position) =>
        Isometry.createPaths(position, cellInfo.cellColor, {
          width: CELL_SIZE,
          height: CELL_SIZE / 2,
        })
      );
      const graphics = new Graphics();
      graphics.svg(`<svg>${paths.join("")}</svg>`);
      cellInfo.isInteractive &&
        this.addCellInteractivity(
          { element: graphics } as Cell,
          cellTypeNumber
        );
      app.stage.addChild(graphics);
    });
  }

  private addCellInteractivity(cell: Cell, cellType: CellType) {
    const countryId = cellType;
    const countryName = getCountryFromId(countryId);
    addHoverStyling(cell.element);
    cell.element.on("click", (e) => {
      dispatch("createCountryDialog", {
        countryName,
        dialogPosition: e.client,
      });
    });
  }
}
