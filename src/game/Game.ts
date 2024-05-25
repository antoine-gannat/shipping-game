import { app } from "../Pixi";
import { CAMERA_MAX_SCALE, CAMERA_MIN_SCALE } from "./constants";
import { DeepReadonly, IPosition } from "../types";
import { subscribe } from "../store";
import { IStore } from "../store/types";
import { renderScene } from "./scenes";

class Game {
  private lastClick: IPosition = { x: -1, y: -1 };
  private store: DeepReadonly<IStore>;
  constructor() {
    // set default scale
    app.stage.scale.x = app.stage.scale.y = CAMERA_MIN_SCALE * 15;
    // add event listeners for camera movement
    window.addEventListener("mousedown", this.onMouseDown.bind(this));
    window.addEventListener("mouseup", this.onMouseUp.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("wheel", this.onWheel.bind(this));
    window.addEventListener("mouseout", this.onMouseUp.bind(this));

    subscribe((prevStore, newStore) => {
      if (prevStore?.scene.kind === newStore.scene.kind) {
        // only re-render if we change scene
        return;
      }
      this.store = newStore;
      // clear the stage
      app.stage.removeChildren();
      if (newStore.scene.defaultScale) {
        app.stage.scale.x = app.stage.scale.y = newStore.scene.defaultScale;
      }

      renderScene(newStore.scene, this.store);

      // center the position (ish)
      app.stage.position.set(app.stage.width / 2, 0);
    });
  }

  public destroy() {
    window.removeEventListener("mousedown", this.onMouseDown.bind(this));
    window.removeEventListener("mouseup", this.onMouseUp.bind(this));
    window.removeEventListener("mousemove", this.onMouseMove.bind(this));
    window.removeEventListener("wheel", this.onWheel.bind(this));
    window.removeEventListener("mouseout", this.onMouseUp.bind(this));
  }

  private onMouseDown(event: MouseEvent) {
    this.lastClick = { x: event.clientX, y: event.clientY };
  }

  private onMouseUp() {
    this.lastClick = { x: -1, y: -1 };
  }

  private onMouseMove(event: MouseEvent) {
    // check which direction the mouse is moving
    if (this.lastClick.x === -1) {
      return;
    }

    const deltaX = Math.abs(event.clientX - this.lastClick.x);
    const deltaY = Math.abs(event.clientY - this.lastClick.y);

    if (event.clientX > this.lastClick.x) {
      app.stage.position.x += deltaX;
    } else if (event.clientX < this.lastClick.x) {
      app.stage.position.x -= deltaX;
    }

    if (event.clientY > this.lastClick.y) {
      app.stage.position.y += deltaY;
    } else if (event.clientY < this.lastClick.y) {
      app.stage.position.y -= deltaY;
    }

    if (app.stage.position.x < -app.stage.width) {
      app.stage.position.x = -app.stage.width;
    }
    if (app.stage.position.y < -app.stage.height) {
      app.stage.position.y = -app.stage.height;
    }
    if (app.stage.position.x > app.stage.width) {
      app.stage.position.x = app.stage.width;
    }
    if (app.stage.position.y > app.stage.height) {
      app.stage.position.y = app.stage.height;
    }

    this.lastClick = { x: event.clientX, y: event.clientY };
  }

  private onWheel(event: WheelEvent) {
    if (event.deltaY > 0) {
      app.stage.scale.x -= 0.1;
      app.stage.scale.y -= 0.1;
    } else {
      app.stage.scale.x += 0.1;
      app.stage.scale.y += 0.1;
    }
    if (app.stage.scale.x > CAMERA_MAX_SCALE) {
      app.stage.scale.x = CAMERA_MAX_SCALE;
      app.stage.scale.y = CAMERA_MAX_SCALE;
    }
    if (app.stage.scale.x < CAMERA_MIN_SCALE) {
      app.stage.scale.x = CAMERA_MIN_SCALE;
      app.stage.scale.y = CAMERA_MIN_SCALE;
    }
  }
}

export default Game;
