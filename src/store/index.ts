import type { DeepReadonly } from "../types";
import { PORT_A_CELLS } from "./constants";
import { handlers } from "./handlers";
import type { IStore, StoreEvent, StoreEventPayload } from "./types";

type StoreListener = (
  // The previous state of the store, null if this is the first call
  prevStore: DeepReadonly<IStore> | null,
  // The new state of the store
  newStore: DeepReadonly<IStore>
) => void;
const subscriptions: Array<StoreListener> = [];

// store instance with initial values
let store: IStore = {
  scene: {
    kind: "port",
    cells: PORT_A_CELLS, // use port A as default
    inventory: {},
    ships: [
      {
        id: 1,
        position: { x: 3, y: 3 },
        static: true,
        inventory: {},
      },
    ],
  },
};

export function getStore(): DeepReadonly<IStore> {
  return store;
}

/**
 * Subscribe to changes in the store.
 * @returns A cleanup function to unsubscribe
 */
export function subscribe(listener: StoreListener): () => void {
  subscriptions.push(listener);
  // send the current store on subscription
  listener(/* prevStore */ null, store);
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
  const previousStore = store;
  store = handlers[eventType](store, payload);
  subscriptions.forEach((listener) => listener(previousStore, store));
  return store;
}
