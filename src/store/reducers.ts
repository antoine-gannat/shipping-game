import { dispatch } from ".";
import { db } from "../database";
import { CAMERA_MAX_SCALE, CAMERA_MIN_SCALE } from "../game/constants";
import { IDialog } from "../react/types";
import { PORT_A_CELLS, PORT_A_CELLS_INFO } from "./constants";
import type { StoreReducer, StoreReducerEvent } from "./types";
import { createWorldCellInfo, worldCells } from "./world";

// Reducers, they are used to modify the store and database.
export const reducers: { [E in StoreReducerEvent]: StoreReducer<E> } = {
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
  createCountryDialog: async (_store, { countryName, position }) => {
    const isOwned = (await db.ports.get({ name: countryName }))?.owned;
    const content: IDialog["content"] = [
      {
        kind: "button",
        text: "Visit port",
        onClick: () => {
          dispatch("visitPort", { portName: countryName });
        },
        closeOnClick: true,
      },
    ];
    if (!isOwned) {
      content.unshift({
        kind: "button",
        text: "Buy port",
        onClick: () => {
          dispatch("buyPort", { portName: countryName }).then(() => {
            dispatch("visitPort", { portName: countryName });
          });
        },
        closeOnClick: true,
      });
    }
    return dispatch("createDialog", {
      title: countryName,
      position,
      content,
    });
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
