import { app } from "../Pixi";
import { Cell } from "./components/Cell";
import { CAMERA_MAX_SCALE, CAMERA_MIN_SCALE, CELL_SIZE } from "./constants";
import { IPosition } from "./types";

const map = [
  [0, 0, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0],
];

class Game {
  private lastClick: IPosition = { x: -1, y: -1 };
  constructor() {
    app.stage.scale.x = app.stage.scale.y = CAMERA_MIN_SCALE * 5;
    window.addEventListener("mousedown", this.onMouseDown.bind(this));
    window.addEventListener("mouseup", this.onMouseUp.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("wheel", this.onWheel.bind(this));
    window.addEventListener("mouseout", this.onMouseUp.bind(this));

    map.forEach((elements, row) => {
      elements.forEach((element, column) => {
        if (element === 0) {
          return;
        }
        app.stage.addChild(
          new Cell(
            this.mapPositionToScreenPosition({ x: column, y: row }),
            "#FFFFFF"
          ).element
        );
      });
    });
  }

  public destroy() {
    window.removeEventListener("mousedown", this.onMouseDown.bind(this));
    window.removeEventListener("mouseup", this.onMouseUp.bind(this));
    window.removeEventListener("mousemove", this.onMouseMove.bind(this));
    window.removeEventListener("wheel", this.onWheel.bind(this));
    window.removeEventListener("mouseout", this.onMouseUp.bind(this));
  }

  private mapPositionToScreenPosition({ x, y }: IPosition): IPosition {
    return {
      x: (x - y) * (CELL_SIZE * 0.88) + y,
      y: (y * 0.955 + x * 0.9) * (CELL_SIZE / 2),
    };
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
