import { IDialog } from "../react/types";
import type {
  CellType,
  DeepReadonly,
  ICellInfo,
  ID,
  IPosition,
  IShip,
} from "../types";

// --- Store --- //

export interface IWritableStore {
  // active scene
  scene: IPortScene | IWorldScene;
  dialogs: IDialog[];
}

// make the store read-only
export type IStore = DeepReadonly<IWritableStore>;

// Reducers

export type StoreReducerEvent =
  | "visitPort"
  | "viewWorld"
  | "addDialog"
  | "removeDialog"
  | "createCountryDialog"
  | "createShipDialog"
  | "newJourney"
  | "journeyEnd"
  | "buyPort";

export type StoreReducerPayload = {
  visitPort: { portName: string };
  buyPort: { portName: string };
  viewWorld: {};
  addDialog: IDialog;
  removeDialog: { dialogId: ID };
  createCountryDialog: { countryName: string; dialogPosition: IPosition };
  createShipDialog: { shipId: ID; dialogPosition: IPosition };
  newJourney: { shipId: ID; destination: string };
  journeyEnd: { journeyId: ID };
};

export type StoreReducer<E extends StoreReducerEvent> = (
  store: IStore,
  payload: StoreReducerPayload[E]
) => Promise<IStore> | IStore;

// Accessors

export type StoreAccessorEvent = "getIsNewPlayer";

export type StoreAccessorPayload = {
  getIsNewPlayer: boolean;
};

export type StoreAccessor<E extends StoreAccessorEvent> = (
  store: IStore
) => Promise<StoreAccessorPayload[E]>;

// --- Scenes --- //

export interface IBaseScene<K extends string = string> {
  kind: K;
  cells: CellType[][];
  // Defines what each cell type looks like.
  cellsInfo: Record<CellType, ICellInfo>;
  defaultScale?: number;
  defaultPosition?: number;
}

export interface IPortScene extends IBaseScene<"port"> {
  portName: string;
  ships: IShip[];
}

export interface IWorldScene extends IBaseScene<"world"> {
  // TODO: add world scene properties
}
