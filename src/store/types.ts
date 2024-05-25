import { IDialog } from "../react/types";
import type { CellType, ICellInfo, IShip } from "../types";

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

// Scenes //

export interface IBaseScene<K extends string = string> {
  kind: K;
  cells: CellType[][];
  // Defines what each cell type looks like.
  cellsInfo: Record<CellType, ICellInfo>;
  defaultScale?: number;
  defaultPosition?: number;
}

export interface IPortScene extends IBaseScene<"port"> {
  ships: IShip[];
}

export interface IWorldScene extends IBaseScene<"world"> {
  // TODO: add world scene properties
}
