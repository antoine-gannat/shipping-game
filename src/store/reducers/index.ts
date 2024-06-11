import { StoreReducer, StoreReducerEvent } from "../types";
import * as dialogsReducers from "./dialogs";
import * as scenesReducers from "./scenes";
import * as portsReducers from "./ports";
import * as journeysReducers from "./journeys";

export const reducers: { [E in StoreReducerEvent]: StoreReducer<E> } = {
  ...dialogsReducers,
  ...scenesReducers,
  ...portsReducers,
  ...journeysReducers,
};
