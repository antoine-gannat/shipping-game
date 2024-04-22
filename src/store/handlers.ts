import { PORT_A_CELLS } from "./constants";
import type { StoreEventHandler, StoreEvent } from "./types";

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
        // TOOD: fetch from port DB
        return {
          ...store,
          scene: {
            kind: "port",
            cells: PORT_A_CELLS,
            inventory: {},
            ships: [],
          },
        };
      case "world":
        return {
          ...store,
          scene: { kind: "world", cells: [], inventory: {} },
        };
      default:
        console.error("Unknown scene kind", sceneKind);
        return store;
    }
  },
};
