import { IDialog } from "../react/types";
import type { IPortScene, IWorldScene } from "../types";

export interface IStore {
  // active scene
  scene: IPortScene | IWorldScene;
  dialogs: IDialog[];
}

export type StoreEvent = "changeScene" | "createDialog" | "removeDialog";

export type StoreEventPayload<T extends StoreEvent> = T extends "changeScene"
  ? { sceneKind: IStore["scene"]["kind"] }
  : T extends "createDialog"
  ? IDialog
  : T extends "removeDialog"
  ? IDialog
  : never;

export type StoreEventHandler<T extends StoreEvent> = (
  store: IStore,
  payload: StoreEventPayload<T>
) => IStore;
