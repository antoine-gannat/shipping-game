import { IBaseScene, IStore } from "../../store/types";
import { DeepReadonly } from "../../types";
import { ISceneRenderer } from "../types";
import { PortRenderer } from "./PortRenderer";
import { WorldRenderer } from "./WorldRenderer";

const sceneRenderers: Record<string, ISceneRenderer> = {
  world: new WorldRenderer(),
  port: new PortRenderer(),
};

export function renderScene(
  scene: DeepReadonly<IBaseScene>,
  store: DeepReadonly<IStore>
) {
  const sceneRenderer = sceneRenderers[scene.kind];
  if (!sceneRenderer) {
    throw new Error(`No renderer for scene kind ${scene.kind}`);
  }
  sceneRenderer.render(scene, store);
}
