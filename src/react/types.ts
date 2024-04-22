import { IStore } from "../store/types";
import { DeepReadonly } from "../types";

export interface IBaseProps {
  store: DeepReadonly<IStore>;
}
