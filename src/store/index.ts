import type { DeepReadonly } from "../types";
import { handlers } from "./handlers";
import type { IStore, StoreEvent, StoreEventPayload } from "./types";

type StoreListener = (newStore: DeepReadonly<IStore>) => void;
const subscriptions: Array<StoreListener> = [];

// store instance with initial values
let store: IStore = {
  map: [
    [1, 1, 1, 1, 1, 2, 2],
    [0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 3, 0],
    [0, 1, 0, 0, 1, 3, 0],
    [0, 1, 0, 0, 0, 0, 0],
  ],
  ships: [
    {
      id: 1,
      position: { x: 3, y: 3 },
      static: true,
    },
  ],
};

export function getStore(): DeepReadonly<IStore> {
  return store;
}

export function subscribe(listener: StoreListener): StoreListener {
  subscriptions.push(listener);
  return () => {
    const index = subscriptions.indexOf(listener);
    if (index !== -1) {
      subscriptions.splice(index, 1);
    }
  };
}

export function dispatch<E extends StoreEvent>(
  eventType: E,
  payload: StoreEventPayload<E>
): DeepReadonly<IStore> {
  if (!handlers[eventType]) {
    console.error("Unknown event type", eventType);
    return store;
  }
  store = handlers[eventType](store, payload);
  subscriptions.forEach((listener) => listener(store));
  return store;
}
