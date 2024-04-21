import type { CellType, IShip } from "../types";

interface IPortScene {
  kind: "port";
  cells: CellType[][];
  inventory: Record<string, number>;
}

interface IWorldScene {
  kind: "world";
  cells: CellType[][];
  // TODO: add world scene properties
}

export interface IStore {
  // active scene
  scene: IPortScene | IWorldScene;
  ships: IShip[];
}

export type StoreEvent = "changeInventory";

export type StoreEventPayload<T extends StoreEvent> =
  T extends "changeInventory" ? { item: string; amount: number } : never;

export type StoreEventHandler = <T extends StoreEvent>(
  store: IStore,
  payload: StoreEventPayload<T>
) => IStore;
