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

export type StoreEventPayload = {
  visitPort: { portName: string };
  buyPort: { portName: string };
  viewWorld: {};
  createDialog: IDialog;
  removeDialog: IDialog;
};

export type StoreReducer<E extends StoreEvent> = (
  store: IStore,
  payload: StoreEventPayload[E]
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
  portName: string;
}

export interface IWorldScene extends IBaseScene<"world"> {
  // TODO: add world scene properties
}
