import type { StoreEventHandler, StoreEvent } from "./types";

export const handlers: Record<StoreEvent, StoreEventHandler> = {
  setMap: (store, payload) => {
    return {
      ...store,
      map: payload.map,
    };
  },
};
