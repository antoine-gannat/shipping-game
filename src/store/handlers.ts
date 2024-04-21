import type { StoreEventHandler, StoreEvents } from "./types";

export const handlers: Record<StoreEvents, StoreEventHandler> = {
  setMap: (store) => {
    return store;
  },
};
