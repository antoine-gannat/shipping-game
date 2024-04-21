import type { CellType, IShip } from "../types";

export type StoreEvents = "setMap";
export type StoreEventHandler = (store: IStore) => IStore;
export interface IStore {
  // Cells displayed in the game
  map: CellType[][];
  ships: IShip[];
}
