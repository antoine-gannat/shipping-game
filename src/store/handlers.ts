import { db } from "../database";
import { CAMERA_MAX_SCALE, CAMERA_MIN_SCALE } from "../game/constants";
import { PORT_A_CELLS, PORT_A_CELLS_INFO } from "./constants";
import type { StoreEventHandler, StoreEvent } from "./types";
import { createWorldCellInfo, worldCells } from "./world";

export const handlers: { [E in StoreEvent]: StoreEventHandler<E> } = {
  viewWorld: async (store) => {
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
  },
  visitPort: async (store, { portName }) => {
    // TODO: Fetch port info from db using port name
    return {
      ...store,
      scene: {
        kind: "port",
        portName,
        cells: PORT_A_CELLS,
        cellsInfo: PORT_A_CELLS_INFO,
        defaultScale: CAMERA_MAX_SCALE / 2,
        inventory: {},
        ships: [],
      },
    };
  },
  createDialog: (store, dialog) => {
    if (store.dialogs.find((d) => d.title === dialog.title)) {
      console.warn("Dialog already exists", dialog.title);
      return store;
    }
    return {
      ...store,
      dialogs: [...store.dialogs, dialog],
    };
  },
  removeDialog: (store, dialog) => {
    return {
      ...store,
      dialogs: store.dialogs.filter((d) => d !== dialog),
    };
  },
  buyPort: (store, { portName }) => {
    db.ports.add({ name: portName, owned: "true" });
    return store;
  },
};
