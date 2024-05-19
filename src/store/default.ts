import { CAMERA_MIN_SCALE } from "../game/constants";
import { IStore } from "./types";
import { createWorldCellInfo, worldCells } from "./world";

export const defaultStore: IStore = {
  scene: {
    // start with the world scene
    kind: "world",
    cells: worldCells,
    cellsInfo: createWorldCellInfo(),
    defaultScale: CAMERA_MIN_SCALE,
  },
};
