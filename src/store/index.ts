import { accessors } from "./accessors";
import { createDefaultStore } from "./default";
import { reducers } from "./reducers";
import type {
  IStore,
  StoreAccessorEvent,
  StoreReducerEvent,
  StoreReducerPayload,
} from "./types";

type StoreListener = (
  // The previous state of the store, null if this is the first call
  prevStore: IStore | null,
  // The new state of the store
  newStore: IStore
) => void;

// List of subscribers to the store.
const subscriptions: Array<StoreListener> = [];

// Queue that stores the promises of the active dispatches.
const activeDispatchesQueue: Promise<void>[] = [];

// Store instance. Do not access directly, instead use `getStore`.
let store: IStore;

function setStore(newStore: IStore) {
  store = newStore;
}

export async function getStore(): Promise<IStore> {
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

/**
 * Dispatches an event.
 * This function will wait for all previous dispatches to be done before executing.
 */
export async function dispatch<E extends StoreReducerEvent>(
  eventType: E,
  payload: StoreReducerPayload[E]
): Promise<IStore> {
  // Wait for previous promises to be done
  let resolveCurrentDispatch: () => void;
  // create a new promise that we'll resolve when this dispatch is done
  const currentDispatch = new Promise<void>((resolve) => {
    resolveCurrentDispatch = resolve;
  });
  // add that promise to the queue
  activeDispatchesQueue.push(currentDispatch);
  // get all promises except the current one
  const dispatchesAhead = activeDispatchesQueue.slice(0, -1);
  // wait for them to resolve
  await Promise.all(dispatchesAhead);

  // now that it's our turn, dispatch the event
  const newStore = await __internalDispatch(eventType, payload);

  // Then, resolve dispatch promise to let the next one go
  resolveCurrentDispatch();
  // and remove it from the array
  const index = activeDispatchesQueue.indexOf(currentDispatch);
  activeDispatchesQueue.splice(index, 1);
  // Finally, return the new store
  return newStore;
}

/**
 * Dispatches the event without entering the dispatch queue.
 * Important: Only to use within the store.
 */
export async function __internalDispatch<E extends StoreReducerEvent>(
  eventType: E,
  payload: StoreReducerPayload[E]
): Promise<IStore> {
  const previousStore = await getStore();
  if (!reducers[eventType]) {
    console.error("No reducer found for event type", eventType);
    return previousStore;
  }
  const newStore =
    (await reducers[eventType](previousStore, payload)) || previousStore;
  subscriptions.forEach((listener) => listener(previousStore, newStore));
  setStore(newStore);
  return newStore;
}

export async function access<E extends StoreAccessorEvent>(eventType: E) {
  const currentStore = await getStore();
  if (!accessors[eventType]) {
    console.error("No accessor found for event type", eventType);
    return null;
  }
  return accessors[eventType](currentStore);
}
