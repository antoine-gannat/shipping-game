import { Graphics } from "pixi.js";
import { app } from "../Pixi";

class Game {
  constructor() {
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    let frame = new Graphics();
    frame.beginFill(0x666666);
    frame.lineStyle({ color: 0xffffff, width: 4, alignment: 0 });
    frame.drawRect(0, 0, 208, 208);
    frame.position.set(320 - 104, 180 - 104);
    app.stage.addChild(frame);
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
