import type { DeepReadonly } from "../types";
import { createDefaultStore } from "./default";
import { reducers } from "./reducers";
import type { IStore, StoreEvent, StoreEventPayload } from "./types";

type StoreListener = (
  // The previous state of the store, null if this is the first call
  prevStore: DeepReadonly<IStore> | null,
  // The new state of the store
  newStore: DeepReadonly<IStore>
) => void;

// List of subscribers to the store
const subscriptions: Array<StoreListener> = [];

// Store instance. Do not access directly, instead use `getStore`.
let store: IStore;

function setStore(newStore: IStore) {
  store = newStore;
}

export async function getStore(): Promise<DeepReadonly<IStore>> {
  if (!store) {
    store = await createDefaultStore();
  }
  return store;
}

/**
 * Subscribe to changes in the store.
 * @returns A cleanup function to unsubscribe
 */
export function subscribe(listener: StoreListener): () => void {
  subscriptions.push(listener);
  // send the current store on subscription
  getStore().then((store) => listener(null, store));
  return () => {
    const index = subscriptions.indexOf(listener);
    if (index !== -1) {
      subscriptions.splice(index, 1);
    }
  };
}

export async function dispatch<E extends StoreEvent>(
  eventType: E,
  payload: StoreEventPayload[E]
): Promise<DeepReadonly<IStore>> {
  const promise = new Promise<IStore>((resolve) => {
    // dispatch the event in the next tick, this helps with concurrency issues
    setTimeout(async () => {
      const previousStore = await getStore();
      if (!reducers[eventType]) {
        console.error("No reducer found for event type", eventType);
        return previousStore;
      }
      const newStore = await reducers[eventType](
        previousStore as IStore,
        payload
      );
      subscriptions.forEach((listener) => listener(previousStore, newStore));
      setStore(newStore);
      resolve(newStore);
    }, 0);
  });
  return promise;
}
