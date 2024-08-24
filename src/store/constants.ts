import { CellType } from "../types";

export const PORT_A_CELLS: CellType[][] = [
  [1, 1, 1, 1, 2, 1, 2],
  [0, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 0, 0, 4],
  [0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 3, 0],
  [0, 1, 0, 0, 1, 3, 0],
  [0, 1, 0, 0, 0, 0, 0],
];

export const PORT_A_CELLS_INFO = {
  0: {
    // Sea
    // This one is not rendered. It's just a placeholder for the sea.
    size: 100,
    isInteractive: false,
  },
  1: {
    // floor
    size: 100,
    cellColor: "#FFFFFF",
    isInteractive: false,
  },
  2: {
    // building
    size: 300,
    asset: "building1",
    cellColor: "#FFFFFF",
    isInteractive: true,
  },
  3: {
    // containers
    size: 200,
    asset: "containers",
    cellColor: "#FFFFFF",
    isInteractive: true,
  },
  4: {
    // containers 2
    size: 1000,
    asset: "container2",
    cellColor: "#FFFFFF",
    isInteractive: true,
  },
};
