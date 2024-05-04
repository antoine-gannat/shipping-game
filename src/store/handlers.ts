import { PORT_A_CELLS, PORT_A_CELLS_INFO } from "./constants";
import type { StoreEventHandler, StoreEvent } from "./types";
import { worldCellInfo, worldCells } from "./world";

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
            cellsInfo: worldCellInfo,
            inventory: {},
          },
        };
      default:
        console.error("Unknown scene kind", sceneKind);
        return store;
    }
  },
};
