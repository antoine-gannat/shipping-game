import * as PIXI from "pixi.js";
import { app } from "../Pixi";
import { Cell } from "./components/Cell";
import { CAMERA_MAX_SCALE, CAMERA_MIN_SCALE, CELL_SIZE } from "./constants";
import { IPosition } from "./types";
import { cellPositionToScreenPosition } from "./utils/cellPosition";

interface ICellInfo {
  size: number;
  asset: string | null;
}

enum CellType {
  Sea,
  Empty,
  Building,
  Containers,
}

const cellsInfo: Record<CellType, ICellInfo> = {
  [CellType.Sea]: {
    size: 100,
    asset: null,
  },
  [CellType.Empty]: {
    size: 100,
    asset: null,
  },
  [CellType.Building]: {
    size: 300,
    asset: "building1",
  },
  [CellType.Containers]: {
    size: 200,
    asset: "containers",
  },
};

const map = [
  [
    CellType.Sea,
    CellType.Containers,
    CellType.Empty,
    CellType.Empty,
    CellType.Empty,
    CellType.Building,
    CellType.Building,
  ],
  [
    CellType.Sea,
    CellType.Empty,
    CellType.Empty,
    CellType.Empty,
    CellType.Sea,
    CellType.Sea,
    CellType.Sea,
  ],
  [
    CellType.Sea,
    CellType.Empty,
    CellType.Empty,
    CellType.Empty,
    CellType.Sea,
    CellType.Sea,
    CellType.Sea,
  ],
  [
    CellType.Sea,
    CellType.Empty,
    CellType.Empty,
    CellType.Empty,
    CellType.Empty,
    CellType.Empty,
    CellType.Sea,
  ],
  [
    CellType.Sea,
    CellType.Empty,
    CellType.Empty,
    CellType.Empty,
    CellType.Empty,
    CellType.Empty,
    CellType.Sea,
  ],
  [
    CellType.Sea,
    CellType.Empty,
    CellType.Sea,
    CellType.Sea,
    CellType.Empty,
    CellType.Empty,
    CellType.Sea,
  ],
  [
    CellType.Sea,
    CellType.Empty,
    CellType.Sea,
    CellType.Sea,
    CellType.Sea,
    CellType.Sea,
    CellType.Sea,
  ],
];

class Game {
  private lastClick: IPosition = { x: -1, y: -1 };
  private hasMoved: boolean = false;
  constructor() {
    app.stage.scale.x = app.stage.scale.y = CAMERA_MIN_SCALE * 15;
    window.addEventListener("mousedown", this.onMouseDown.bind(this));
    window.addEventListener("mouseup", this.onMouseUp.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
    window.addEventListener("wheel", this.onWheel.bind(this));
    window.addEventListener("mouseout", this.onMouseUp.bind(this));
    window.addEventListener("click", this.onClick.bind(this));

    this.drawWave(8, 4);
    this.drawWave(8, 5);
    this.drawWave(8, 6);

    this.drawShip(3, 3, true).then((ship) => {
      ship.gotoAndStop(0);
    });

    this.drawShip(9, 7).then((ship) => {
      app.ticker.add(() => {
        ship.x -= 1;
        ship.y += 0.5;
      });
    });

    map.forEach((elements, row) => {
      elements.forEach((element, column) => {
        if (element === 0) {
          return;
        }
        const position = {
          x: column,
          y: row,
        };
        app.stage.addChild(new Cell(position, `#FFFFFF`).element);
        const cell = cellsInfo[element];
        if (cell.asset) {
          const sprite = PIXI.Sprite.from(`/assets/${cell.asset}.png`);
          const scaleDownAmount = CELL_SIZE / cell.size;
          sprite.scale.set(scaleDownAmount);

          const { x, y } = cellPositionToScreenPosition(position);
          sprite.position.set(x + CELL_SIZE * 0.365, y); // magic
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
    window.removeEventListener("click", this.onClick.bind(this));
  }

  private createFramesForAnimation(
    animationName: string,
    frameSize: { width: number; height: number },
    frameCount = 4,
    frameStart = 0
  ): PIXI.ISpritesheetData["frames"] {
    const frames: PIXI.ISpritesheetData["frames"] = {};

    for (let i = frameStart; i < frameCount; i++) {
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

  private async drawShip(
    x: number,
    y: number,
    isStatic = false
  ): Promise<PIXI.AnimatedSprite> {
    const frames = this.createFramesForAnimation(
      "ship-move",
      {
        width: 500,
        height: 500,
      },
      4,
      isStatic ? 0 : 1
    );

    const atlasData = {
      frames,
      meta: {
        image: "assets/cargo-ship.png",
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
    const ship = new PIXI.AnimatedSprite(spritesheet.animations.wave);

    // set the animation speed
    ship.animationSpeed = 0.05;
    // play the animation on a loop
    ship.play();

    const pos = cellPositionToScreenPosition({ x, y });
    ship.position.set(pos.x + CELL_SIZE * 0.365, pos.y);
    // add it to the stage to render
    app.stage.addChild(ship);

    return ship;
  }

  private async drawWave(x: number, y: number) {
    // Create object to store sprite sheet data
    const frames = this.createFramesForAnimation("wave", {
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
    anim.play();

    const pos = this.mapPositionToScreenPosition({ x, y });
    anim.setTransform(
      /* x */ pos.x,
      /* y */ pos.y,
      /* scaleX */ 0.5, // reduce from 200px to 100px
      /* scaley */ 0.5, // reduce from 200px to 100px
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

  private onClick({ clientX, clientY }: MouseEvent) {
    // if the click is related to a drag event, ignore it
    if (this.hasMoved) {
      return;
    }
    const cellX = Math.round((clientX - app.stage.position.x) / CELL_SIZE);
    const cellY = Math.round((clientY - app.stage.position.y) / CELL_SIZE);
    console.log(cellX, cellY);
  }

  private onMouseDown(event: MouseEvent) {
    this.hasMoved = false;
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
    this.hasMoved = true;

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
      // app.stage.scale.x = CAMERA_MAX_SCALE;
      // app.stage.scale.y = CAMERA_MAX_SCALE;
    }
    if (app.stage.scale.x < CAMERA_MIN_SCALE) {
      app.stage.scale.x = CAMERA_MIN_SCALE;
      app.stage.scale.y = CAMERA_MIN_SCALE;
    }
  }
}

export default Game;
