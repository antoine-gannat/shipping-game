import { app } from "../Pixi";
import { Cell } from "./components/Cell";
import { CELL_SIZE } from "./constants";

class Game {
  constructor() {
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    app.stage.addChild(new Cell({ x: 200, y: 100 }, "#FF0000").element);
    app.stage.addChild(
      new Cell(
        {
          x: 200 + CELL_SIZE * 0.88,
          y: 100 + CELL_SIZE / 2 - CELL_SIZE * 0.05,
        },
        "#FF0000"
      ).element
    );
  }

  public destroy() {
    window.removeEventListener("keydown", this.onKeyDown.bind(this));
  }

  private onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        app.stage.position.y -= 10;
        break;
      case "ArrowDown":
        app.stage.position.y += 10;
        break;
      case "ArrowLeft":
        app.stage.position.x -= 10;
        break;
      case "ArrowRight":
        app.stage.position.x += 10;
        break;
      case "PageUp":
        app.stage.scale.x += 0.1;
        app.stage.scale.y += 0.1;
        break;
      case "PageDown":
        app.stage.scale.x -= 0.1;
        app.stage.scale.y -= 0.1;
        break;
    }
  }
}

export default Game;
