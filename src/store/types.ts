import { IDialog } from "../react/types";
import type { IPortScene, IWorldScene } from "../types";

export interface IStore {
  // active scene
  scene: IPortScene | IWorldScene;
  dialogs: IDialog[];
}

export type StoreEvent =
  | "visitPort"
  | "viewWorld"
  | "createDialog"
  | "removeDialog"
  | "buyPort";

export type StoreEventPayload<T extends StoreEvent> = T extends "visitPort"
  ? { portName: string }
  : T extends "viewWorld"
  ? {}
  : T extends "createDialog"
  ? IDialog
  : T extends "removeDialog"
  ? IDialog
  : T extends "buyPort"
  ? { portName: string }
  : never;

export type StoreEventHandler<T extends StoreEvent> = (
  store: IStore,
  payload: StoreEventPayload<T>
) => Promise<IStore> | IStore;
