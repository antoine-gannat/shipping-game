import { IBaseScene, IStore } from "../store/types";
import { DeepReadonly } from "../types";

export interface ISceneRenderer<S extends IBaseScene = IBaseScene> {
  render(scene: DeepReadonly<S>, store: IStore): void;
}
