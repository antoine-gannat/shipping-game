import { db } from "../../database";
import { CAMERA_MAX_SCALE, CAMERA_MIN_SCALE } from "../../game/constants";
import { PORT_A_CELLS, PORT_A_CELLS_INFO } from "../constants";
import { StoreReducer } from "../types";
import { createWorldCellInfo, worldCells } from "../world";

export const viewWorld: StoreReducer<"viewWorld"> = async (store) => {
  return {
    ...store,
    scene: {
      kind: "world",
      cells: worldCells,
      cellsInfo: await createWorldCellInfo(),
      defaultScale: CAMERA_MIN_SCALE,
      inventory: {},
    },
  };
};

export const visitPort: StoreReducer<"visitPort"> = async (
  store,
  { portName }
) => {
  const port = await db.ports.get({ name: portName });
  if (!port) {
    console.warn("Port not found", portName);
    return store;
  }

  return {
    ...store,
    scene: {
      kind: "port",
      portName,
      // TODO: Change port cells based on port
      cells: PORT_A_CELLS,
      cellsInfo: PORT_A_CELLS_INFO,
      defaultScale: CAMERA_MAX_SCALE / 2,
      inventory: {},
      ships: port.ships.map((s) => ({
        id: s,
        static: true,
        position: { x: 3, y: 3 },
      })),
    },
  };
};
