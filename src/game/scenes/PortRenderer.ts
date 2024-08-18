import * as PIXI from "pixi.js";
import { app } from "../../Pixi";
import { IPortScene } from "../../store/types";
import { CellType, DeepReadonly, IShip } from "../../types";
import { ISceneRenderer } from "../types";
import { CELL_SIZE } from "../constants";
import { cellPositionToScreenPosition } from "../utils/cellPosition";
import { addHoverStyling } from "../utils/addHoverStyling";
import { dispatch } from "../../store";
import { Cell } from "../components/Cell";

export class PortRenderer implements ISceneRenderer<IPortScene> {
  public render(scene: DeepReadonly<IPortScene>) {
    // Draw ships
    scene.ships.forEach((ship) => {
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
    scene.cells.forEach((rowOfCells, row) => {
      rowOfCells.forEach(async (cellType, column) => {
        const cellInfo = scene.cellsInfo[cellType as CellType];
        if (!cellInfo || !cellInfo.cellColor) {
          return;
        }
        const position = {
          x: column,
          y: row,
        };
        const cell = new Cell(position, cellInfo.cellColor);
        app.stage.addChild(cell.element);

        // if that cell also has an asset, render it
        if (cellInfo.asset) {
          const texture = await PIXI.Assets.load(
            `./assets/${cellInfo.asset}.png`
          );
          const sprite = PIXI.Sprite.from(texture);
          const scaleDownAmount = CELL_SIZE / cellInfo.size;
          sprite.scale.set(scaleDownAmount);

          const { x, y } = cellPositionToScreenPosition(position);
          sprite.position.set(x + CELL_SIZE * 0.365, y); // magic

          if (cellInfo.isInteractive) {
            addHoverStyling(sprite, 0.9);

            sprite.on("click", () => {
              // no-op
            });
          }
          app.stage.addChild(sprite);
        }
      });
    });
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

    const atlasData: PIXI.SpritesheetData = {
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

    const texture = await PIXI.Assets.load(atlasData.meta.image);
    // Create the SpriteSheet from data and image
    const spritesheet = new PIXI.Spritesheet(texture, atlasData);

    // Generate all the Textures asynchronously
    await spritesheet.parse();

    // spritesheet is ready to use!
    const shipAnimation = new PIXI.AnimatedSprite(spritesheet.animations.wave);

    // set the animation speed
    shipAnimation.animationSpeed = 0.05;
    // play the animation on a loop
    shipAnimation.play();

    const pos = cellPositionToScreenPosition(ship.position);
    shipAnimation.position.set(pos.x + CELL_SIZE * 0.365, pos.y);

    if (ship.static) {
      addHoverStyling(shipAnimation, 0.9);
      shipAnimation.on("click", (e) => {
        dispatch("createShipDialog", {
          shipId: ship.id,
          dialogPosition: e.client,
        });
      });
    }
    // add it to the stage to render
    app.stage.addChild(shipAnimation);

    return shipAnimation;
  }

  private createFramesForAnimation(
    animationName: string,
    frameSize: { width: number; height: number },
    frameCount = 4,
    frameStart = 0
  ): PIXI.SpritesheetData["frames"] {
    const frames: PIXI.SpritesheetData["frames"] = {};

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
}
