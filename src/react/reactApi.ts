type UIEvent = "show-ship-info" | "show-building-info" | "show-country-info";

type UIEventData<E extends UIEvent> = E extends "show-ship-info"
  ? { shipId: number; clickPosition: { x: number; y: number } }
  : E extends "show-building-info"
  ? { buildingId: number; clickPosition: { x: number; y: number } }
  : E extends "show-country-info"
  ? { countryId: number; clickPosition: { x: number; y: number } }
  : never;

type UIEventCallback<E extends UIEvent> = (data: UIEventData<E>) => void;

const listeners: { [K in UIEvent]: UIEventCallback<K>[] } = {
  "show-ship-info": [],
  "show-building-info": [],
  "show-country-info": [],
};

export function callUIApi<E extends UIEvent>(
  event: E,
  data: UIEventData<E>
): void {
  listeners[event].forEach((listener) => listener(data));
}

export function registerUIApi<E extends UIEvent>(
  event: E,
  callback: UIEventCallback<E>
): () => void {
  listeners[event].push(callback);

  // return cleanup function
  return () => {
    const index = listeners[event].indexOf(callback);
    if (index !== -1) {
      listeners[event].splice(index, 1);
    }
  };
}
