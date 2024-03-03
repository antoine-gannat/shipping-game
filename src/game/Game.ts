import * as PIXI from "pixi.js";
import { app } from "../Pixi";
import { Cell } from "./components/Cell";
import { CAMERA_MAX_SCALE, CAMERA_MIN_SCALE, CELL_SIZE } from "./constants";
import { IPosition } from "./types";
import { randomInteger } from "./utils/rand";

const map = [
  [0, 0, 1, 1, 1, 0, 2],
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

    this.drawWave(8, 4);
    this.drawWave(8, 5);
    this.drawWave(8, 6);

    map.forEach((elements, row) => {
      elements.forEach((element, column) => {
        if (element === 0) {
          return;
        }
        const position = this.mapPositionToScreenPosition({
          x: column,
          y: row,
        });
        app.stage.addChild(new Cell(position, "#FFFFFF").element);
        let assetName;
        switch (element) {
          case 2:
            assetName = "building1";
            break;
        }
        if (assetName) {
          const sprite = PIXI.Sprite.from(`/assets/${assetName}.png`);
          sprite.scale.set(0.5);
          sprite.position.set(
            position.x + CELL_SIZE / 5,
            position.y - CELL_SIZE / 1.3
          );
          app.stage.addChild(sprite);
        }
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

  private async drawWave(x: number, y: number) {
    function createFramesForAnimation(
      animationName: string,
      frameSize: { width: number; height: number }
    ): PIXI.ISpritesheetData["frames"] {
      const frames: PIXI.ISpritesheetData["frames"] = {};

      for (let i = 0; i < 4; i++) {
        frames[`${animationName}${i}`] = {
          frame: {
            x: i * frameSize.width,
            y: 0,
            w: frameSize.width,
            h: frameSize.height,
          },
          sourceSize: { w: frameSize.width, h: frameSize.height },
        };
      }
      return frames;
    }
    // Create object to store sprite sheet data
    const frames = createFramesForAnimation("wave", {
      width: 200,
      height: 200,
    });
    const atlasData = {
      frames,
      meta: {
        image: "assets/wave-sprite.png",
        format: "RGBA8888",
        size: { w: CELL_SIZE, h: CELL_SIZE },
        scale: 1,
      },
      animations: {
        wave: Object.keys(frames), //array of frames by name
      },
    };

    // Create the SpriteSheet from data and image
    const spritesheet = new PIXI.Spritesheet(
      PIXI.BaseTexture.from(atlasData.meta.image),
      atlasData
    );

    // Generate all the Textures asynchronously
    await spritesheet.parse();

    // spritesheet is ready to use!
    const anim = new PIXI.AnimatedSprite(spritesheet.animations.wave);

    // set the animation speed
    anim.animationSpeed = 0.02;
    // play the animation on a loop
    anim.gotoAndPlay(randomInteger(0, 4));

    const pos = this.mapPositionToScreenPosition({ x, y });
    anim.setTransform(
      /* x */ pos.x,
      /* y */ pos.y,
      /* scaleX */ 0.5,
      /* scaley */ 0.5,
      /* rotation */ 0,
      /* skewX */ 1.1,
      /* skewY */ -0.5,
      /* pivotX */ 0,
      /* pivotY */ 0
    );
    // add it to the stage to render
    app.stage.addChild(anim);
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
