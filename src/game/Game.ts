import * as PIXI from "pixi.js";
import { app } from "../Pixi";
import { Cell } from "./components/Cell";
import { CAMERA_MAX_SCALE, CAMERA_MIN_SCALE, CELL_SIZE } from "./constants";
import { CellType, IPosition, IShip } from "../types";
import { cellPositionToScreenPosition } from "./utils/cellPosition";
import { addHoverStyling } from "./utils/addHoverStyling";
import { dispatch, getStore, subscribe } from "../store";
import { getCountryFromId } from "../store/world";

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
      if (newStore.scene.defaultScale) {
        app.stage.scale.x = app.stage.scale.y = newStore.scene.defaultScale;
      }

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
      addHoverStyling(shipSprite);
      shipSprite.on("click", (e) => {
        dispatch("createDialog", {
          title: `Ship ${ship.id} info`,
          position: e.client,
          content: [{ kind: "text", text: "This is a ship" }],
        });
      });
    }
    // add it to the stage to render
    app.stage.addChild(shipSprite);

    return shipSprite;
  }

  private drawMapElement(kind: CellType, row: number, column: number) {
    const store = getStore();
    const cellInfo = store.scene.cellsInfo[kind as CellType];

    // if no render information is given, don't render anything
    if (!cellInfo.asset && !cellInfo.cellColor) {
      return;
    }
    const position = {
      x: column,
      y: row,
    };
    // calculate if the cell has neighbors, if not, we'll render the sides
    const hasLeftNeighbor =
      store.scene.cells[position.y + 1]?.[position.x] === kind;
    const hasRightNeighbor =
      store.scene.cells[position.y]?.[position.x + 1] === kind;

    let cell: Cell;
    // create the cell
    if (cellInfo.cellColor) {
      cell = new Cell(
        position,
        cellInfo.cellColor,
        hasLeftNeighbor,
        hasRightNeighbor
      );
      app.stage.addChild(cell.element);
    }
    if (cellInfo.asset) {
      const sprite = PIXI.Sprite.from(`./assets/${cellInfo.asset}.png`);
      const scaleDownAmount = CELL_SIZE / cellInfo.size;
      sprite.scale.set(scaleDownAmount);

      const { x, y } = cellPositionToScreenPosition(position);
      sprite.position.set(x + CELL_SIZE * 0.365, y); // magic

      if (cellInfo.isInteractive) {
        addHoverStyling(sprite);

        sprite.on("click", (e) => {
          dispatch("createDialog", {
            title: "Building 1",
            position: e.client,
            content: [{ kind: "text", text: "This is a building" }],
          });
        });
      }
      app.stage.addChild(sprite);
    } else if (cellInfo.cellColor && cellInfo.isInteractive) {
      addHoverStyling(cell.element);
      cell.element.on("click", (e) => {
        dispatch("createDialog", {
          title: "Country info",
          position: e.client,
          content: [
            {
              kind: "button",
              text: getCountryFromId(kind),
              onClick: () => {
                dispatch("changeScene", { sceneKind: "port" });
              },
              closeOnClick: true,
            },
          ],
        });
      });
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
