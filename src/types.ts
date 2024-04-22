export interface IPosition {
  x: number;
  y: number;
}

export interface IShip {
  id: number;
  position: IPosition;
  static: boolean;
  inventory: Inventory;
}

type Inventory = Record<string, number>;

export interface IPortScene {
  kind: "port";
  cells: CellType[][];
  inventory: Inventory;
}

export interface IWorldScene {
  kind: "world";
  cells: CellType[][];
  // TODO: add world scene properties
}

export enum CellType {
  Sea,
  Empty,
  Building,
  Containers,
}

// Utils

export type DeepReadonly<T> = Readonly<{
  [K in keyof T]: T[K] extends number | string | symbol // Is it a primitive? Then make it readonly
    ? Readonly<T[K]>
    : // Is it an array of items? Then make the array readonly and the item as well
    T[K] extends Array<infer A>
    ? Readonly<Array<DeepReadonly<A>>>
    : // It is some other object, make it readonly as well
      DeepReadonly<T[K]>;
}>;
