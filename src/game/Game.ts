import * as PIXI from "pixi.js";
import { app } from "../Pixi";
import { Cell } from "./components/Cell";
import { CAMERA_MAX_SCALE, CAMERA_MIN_SCALE, CELL_SIZE } from "./constants";
import { CellType, IPosition, IShip } from "../types";
import { cellPositionToScreenPosition } from "./utils/cellPosition";
import { addHoverStyling } from "./utils/addHoverStyling";
import { callUIApi } from "../react/reactApi";
import { getStore, subscribe } from "../store";

interface ICellInfo {
  size: number;
  asset: string | null;
  isInteractive: boolean;
}

const cellsInfo: Record<CellType, ICellInfo> = {
  [CellType.Sea]: {
    size: 100,
    asset: null,
    isInteractive: false,
  },
  [CellType.Empty]: {
    size: 100,
    asset: null,
    isInteractive: false,
  },
  [CellType.Building]: {
    size: 300,
    asset: "building1",
    isInteractive: true,
  },
  [CellType.Containers]: {
    size: 200,
    asset: "containers",
    isInteractive: true,
  },
};

class Game {
  private lastClick: IPosition = { x: -1, y: -1 };
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
      // clear the stage
      app.stage.removeChildren();

      // Draw ships
      "ships" in newStore.scene &&
        newStore.scene.ships.forEach((ship) => {
          this.drawShip(ship).then((sprite) => {
            if (!ship.static) {
              app.ticker.add(() => {
                sprite.x -= 1;
                sprite.y += 0.5;
              });
            } else {
              sprite.gotoAndStop(0);
            }
          });
        });

      // Draw map
      newStore.scene.cells.forEach((rowOfCells, row) => {
        rowOfCells.forEach((cell, column) => {
          this.drawMapElement(cell, row, column);
        });
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

  private async drawShip(ship: IShip): Promise<PIXI.AnimatedSprite> {
    const frames = this.createFramesForAnimation(
      "ship-move",
      {
        width: 500,
        height: 500,
      },
      4,
      ship.static ? 0 : 1
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
    const shipSprite = new PIXI.AnimatedSprite(spritesheet.animations.wave);

    // set the animation speed
    shipSprite.animationSpeed = 0.05;
    // play the animation on a loop
    shipSprite.play();

    const pos = cellPositionToScreenPosition(ship.position);
    shipSprite.position.set(pos.x + CELL_SIZE * 0.365, pos.y);

    if (ship.static) {
      shipSprite.eventMode = "static";
      addHoverStyling(shipSprite);
      shipSprite.on("click", (e) => {
        callUIApi("show-ship-info", {
          shipId: ship.id,
          clickPosition: e.client,
        });
      });
    }
    // add it to the stage to render
    app.stage.addChild(shipSprite);

    return shipSprite;
  }

  private drawMapElement(kind: CellType, row: number, column: number) {
    if (kind === CellType.Sea) {
      return;
    }
    const position = {
      x: column,
      y: row,
    };
    const store = getStore();
    const hasLeftNeighbor =
      store.scene.cells[position.y + 1]?.[position.x] === kind;
    const hasRightNeighbor =
      store.scene.cells[position.y]?.[position.x + 1] === kind;
    app.stage.addChild(
      new Cell(position, `#FFFFFF`, hasLeftNeighbor, hasRightNeighbor).element
    );
    const cell = cellsInfo[kind as CellType];
    if (cell.asset) {
      const sprite = PIXI.Sprite.from(`/assets/${cell.asset}.png`);
      const scaleDownAmount = CELL_SIZE / cell.size;
      sprite.scale.set(scaleDownAmount);

      const { x, y } = cellPositionToScreenPosition(position);
      sprite.position.set(x + CELL_SIZE * 0.365, y); // magic

      if (cell.isInteractive) {
        sprite.eventMode = "static";
        addHoverStyling(sprite);

        sprite.on("click", (e) => {
          callUIApi("show-building-info", {
            buildingId: 1,
            clickPosition: e.client,
          });
        });
      }
      app.stage.addChild(sprite);
    }
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
