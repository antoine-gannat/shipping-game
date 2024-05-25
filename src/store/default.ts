import { CAMERA_MIN_SCALE } from "../game/constants";
import { IStore } from "./types";
import { createWorldCellInfo, worldCells } from "./world";

export async function createDefaultStore(): Promise<IStore> {
  return {
    scene: {
      // start with the world scene
      kind: "world",
      cells: worldCells,
      cellsInfo: await createWorldCellInfo(),
      defaultScale: CAMERA_MIN_SCALE,
    },
    dialogs: [],
  };
}
