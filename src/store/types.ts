import type { IPortScene, IShip, IWorldScene } from "../types";

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
