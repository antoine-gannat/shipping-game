import { ID } from "../types";

let index = 1;

/**
 * Returns a unique ID.
 *
 * Note: This is a simple incrementing number.
 */
export function uniqueRuntimeId(): ID {
  return index++;
}
