import type { StoreEventHandler, StoreEvent } from "./types";

export const handlers: Record<StoreEvent, StoreEventHandler> = {
  changeInventory: (store, { item, amount }) => {
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
};
