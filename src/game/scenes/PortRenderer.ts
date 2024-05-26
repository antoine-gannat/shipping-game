import * as PIXI from "pixi.js";
import { app } from "../../Pixi";
import { IPortScene } from "../../store/types";
import { CellType, DeepReadonly, IPosition, IShip } from "../../types";
import { ISceneRenderer } from "../types";
import { CELL_SIZE } from "../constants";
import { cellPositionToScreenPosition } from "../utils/cellPosition";
import { addHoverStyling } from "../utils/addHoverStyling";
import { dispatch } from "../../store";
import { Cell } from "../components/Cell";

export class PortRenderer implements ISceneRenderer<IPortScene> {
  constructor() {}

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

    const canBeMergedCells = this.getCellsThatCanMerge(scene);

    // Draw map
    scene.cells.forEach((rowOfCells, row) => {
      rowOfCells.forEach((cellType, column) => {
        const cellInfo = scene.cellsInfo[cellType as CellType];
        if (!cellInfo || !cellInfo.cellColor) {
          return;
        }
        const shouldRenderMergedCell = canBeMergedCells.some(
          (position) => position.x === column && position.y === row
        );
        const wasCurrentCellMerged = canBeMergedCells.some(
          (position) =>
            (position.x === column - 1 && position.y === row - 1) ||
            (position.x === column && position.y === row - 1) ||
            (position.x === column - 1 && position.y === row)
        );
        if (wasCurrentCellMerged) {
          return;
        }
        const position = {
          x: column,
          y: row,
        };
        const cell = new Cell(
          position,
          shouldRenderMergedCell ? "#ff0000" : cellInfo.cellColor,
          scene.cells,
          scene.cellsInfo,
          shouldRenderMergedCell
        );
        app.stage.addChild(cell.element);

        // if that cell also has an asset, render it
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
        }
      });
    });
  }

  // To improve performances, merge 4 cells into one
  private getCellsThatCanMerge(scene: DeepReadonly<IPortScene>): IPosition[] {
    const canBeMergedCells: IPosition[] = [];

    for (let row = 0; row < scene.cells.length; row += 2) {
      for (let column = 0; column < scene.cells[row].length; column += 2) {
        const topLeftCell = scene.cells[row][column];
        const topRightCell = scene.cells[row][column + 1];
        const bottomLeftCell =
          scene.cells[row + 1] && scene.cells[row + 1][column];
        const bottomRightCell =
          scene.cells[row + 1] && scene.cells[row + 1][column + 1];

        if (
          topLeftCell === topRightCell &&
          topRightCell === bottomLeftCell &&
          bottomLeftCell === bottomRightCell
        ) {
          canBeMergedCells.push({ x: column, y: row });
        }
      }
    }
    return canBeMergedCells;
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
}
