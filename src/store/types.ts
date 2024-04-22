import type { IPortScene, IShip, IWorldScene } from "../types";

export interface IStore {
  // active scene
  scene: IPortScene | IWorldScene;
  ships: IShip[];
}

export type StoreEvent = "changePortInventory" | "changeScene";

export type StoreEventPayload<T extends StoreEvent> =
  T extends "changePortInventory"
    ? { item: string; amount: number }
    : T extends "changeScene"
    ? { sceneKind: IStore["scene"]["kind"] }
    : never;

export type StoreEventHandler<T extends StoreEvent> = (
  store: IStore,
  payload: StoreEventPayload<T>
) => IStore;
