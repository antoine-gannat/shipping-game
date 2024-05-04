import { ICellInfo } from "../types";
import { randomInteger } from "../utils/rand";
import { PORT_A_CELLS, PORT_A_CELLS_INFO, countryColors } from "./constants";
import type { StoreEventHandler, StoreEvent } from "./types";
import { worldCells } from "./world";

export const handlers: { [E in StoreEvent]: StoreEventHandler<E> } = {
  changePortInventory: (store, { item, amount }) => {
    const { scene } = store;
    if (scene.kind !== "port" || !scene.inventory) {
      console.error("Can't change inventory in this scene", scene);
      return store;
    }
    if (amount === 0) {
      delete scene.inventory[item];
      return store;
    }
    scene.inventory[item] = (scene.inventory[item] || 0) + amount;
    return store;
  },
  changeScene: (store, { sceneKind }) => {
    switch (sceneKind) {
      case "port":
        // TODO: fetch from port DB
        return {
          ...store,
          scene: {
            kind: "port",
            cells: PORT_A_CELLS,
            cellsInfo: PORT_A_CELLS_INFO,
            inventory: {},
            ships: [],
          },
        };
      case "world":
        return {
          ...store,
          scene: {
            kind: "world",
            cells: worldCells,
            cellsInfo: Array.from({ length: 159 /* nb countries */ }).reduce<
              Record<number, ICellInfo>
            >((acc, _, i) => {
              if (i === 0) {
                acc[i] = {
                  size: 100,
                  isInteractive: false,
                };
                return acc;
              }
              acc[i] = {
                size: 100,
                cellColor:
                  countryColors[randomInteger(0, countryColors.length - 1)],
                isInteractive: true,
              };
              return acc;
            }, {}),
            inventory: {},
          },
        };
      default:
        console.error("Unknown scene kind", sceneKind);
        return store;
    }
  },
};
