import { CellType } from "../types";

export const PORT_A_CELLS: CellType[][] = [
  [1, 1, 1, 1, 1, 2, 2],
  [0, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 0],
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
};

export const countryColors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#000000",
  "#FFFFFF",
  "#C0C0C0",
  "#808080",
  "#800000",
  "#808000",
  "#008000",
  "#800080",
  "#008080",
  "#000080",
  "#FFA07A",
  "#20B2AA",
  "#FF6347",
  "#7B68EE",
  "#00FA9A",
  "#FFD700",
  "#FF69B4",
  "#D2B48C",
  "#A52A2A",
];
