import type { IPortScene, IWorldScene } from "../types";

export interface IStore {
  // active scene
  scene: IPortScene | IWorldScene;
}

export type StoreEvent = "changeScene";

export type StoreEventPayload<T extends StoreEvent> = T extends "changeScene"
  ? { sceneKind: IStore["scene"]["kind"] }
  : never;

export type StoreEventHandler<T extends StoreEvent> = (
  store: IStore,
  payload: StoreEventPayload<T>
) => IStore;
