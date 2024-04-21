import type { CellType, IShip } from "../types";

export type StoreEvent = "setMap";
export type StoreEventPayload<T extends StoreEvent> = T extends "setMap"
  ? Pick<IStore, "map">
  : never;
export type StoreEventHandler = <T extends StoreEvent>(
  store: IStore,
  payload: StoreEventPayload<T>
) => IStore;
export interface IStore {
  // Cells displayed in the game
  map: CellType[][];
  ships: IShip[];
}
