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
  buyPort: async (store, { portName }) => {
    const isFirstPort = !!!(await db.ports.count());
    console.log(isFirstPort);
    // if this is the first port to be bought, add a ship to it
    const newPortId = await db.ports.add({
      name: portName,
      owned: "true",
      ships: [],
    });
    if (isFirstPort) {
      const newShipId = await db.ships.add({
        name: "First ship",
        type: "cargo-small",
        portId: newPortId,
      });
      await db.ports.update(newPortId, { ships: [newShipId] });
    }
    return store;
  },
  newJourney: async (store, { shipId, destination }) => {
    const ship = await db.ships.get({ id: shipId });
    if (!ship) {
      console.warn("Ship not found", shipId);
      return store;
    }
    // check if the ship is already on a journey
    const isOnJourney = await db.journeys.get({ shipId });
    if (isOnJourney) {
      console.warn("Ship is already on a journey", shipId);
      return store;
    }
    // find current port
    const originPort = await db.ports
      .filter((port) => port.ships.includes(shipId))
      .first();
    if (!originPort) {
      console.warn("No port found with with ship", shipId);
      return store;
    }
    // find the destination
    const destinationPort = await db.ports.get({ name: destination });
    if (!destinationPort) {
      console.warn("Destination port not found", destination);
      return store;
    }
    // TODO: Add journey duration calculation
    const duration = 1000 * 60;
    await db.journeys.add({
      shipId,
      originPortId: originPort.id,
      destinationPortId: destinationPort.id,
      departureTime: Date.now(),
      duration,
    });
  },
};
