import {
  CELL_HEIGHT,
  CELL_SIZE,
  MAGIC_X_POSITION_MULTIPLIER,
} from "../constants";
import { IPosition } from "../types";

/**
 * Calculate the position of the cell based on CELL_SIZE and the position.
 *
 * For each x:
 *    - move right by `CELL_SIZE` minus magic.
 *    - move down by `CELL_HEIGHT`
 *
 * For each y:
 *    - move left by `CELL_SIZE` minus magic.
 *    - move down by `CELL_HEIGHT`.
 */

export const cellPositionToScreenPosition = (
  position: IPosition,
  cellSize = CELL_SIZE,
  cellHeight = CELL_HEIGHT
): IPosition => {
  const x =
    (cellSize * position.x - position.y * cellSize) *
    MAGIC_X_POSITION_MULTIPLIER;
  const y = cellHeight * position.x + position.y * cellHeight;
  return { x, y };
};
