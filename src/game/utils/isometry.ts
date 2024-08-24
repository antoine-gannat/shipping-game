import { IPosition } from "../../types";
import { CELL_SIZE } from "../constants";
import { shadeColor } from "./shadeColor";

type Svg = string;
type Size = { width: number; height: number };

const svgCache: Record<string, string> = {};

/**
 * Helper class used to create isometric shapes and convert positions.
 */
export class Isometry {
  /**
   * Create an SVG of a cube with a given size and color.
   */
  public static createCube(size: Size, color: string): Svg {
    const cacheKey = `${size}-${color}`;
    // if we have it in cache, return it
    if (svgCache[cacheKey]) return svgCache[cacheKey];

    // create a single cube, position 0,0
    const paths = Isometry.createPaths({ x: 0, y: 0 }, color, size);
    const newSvg = `<svg width="${size}" height="${size}">${paths}</svg>`;

    // cache it and return
    svgCache[cacheKey] = newSvg;
    return newSvg;
  }

  /**
   * Create the SVG paths for an isometric cube.
   */
  public static createPaths(
    pos: IPosition,
    color: string,
    size: Size = { width: CELL_SIZE, height: CELL_SIZE }
  ) {
    // convert the grid position to the isometric screen position
    const isometricPosition = Isometry.gridPosToIsometricScreenPos(pos, size);
    // get the points of the isometric shape
    const { topFacePath, leftFacePath, rightFacePath } =
      Isometry.getFacesPoints(isometricPosition, size);

    // create the colors for each face
    const topColor = color;
    const leftColor = shadeColor(color, -20);
    const rightColor = shadeColor(color, -30);

    const topFace = `<path d="${topFacePath}" fill="${topColor}" stroke="${topColor}" />`;
    const leftFace = `<path d="${leftFacePath}" fill="${leftColor}" stroke="${leftColor}" />`;
    const rightFace = `<path d="${rightFacePath}" fill="${rightColor}" stroke="${rightColor}" />`;

    // merge the faces
    return `${topFace}${leftFace}${rightFace}`;
  }

  /**
   * Take a position in a grid and convert it to an isometric position.
   * @param pos The position in the grid, such as { x: 2, y: 5 }
   * @param size The size of a cell
   * @returns The isometric position, aka screen position, such as { x: 100, y: 240 }
   */
  public static gridPosToIsometricScreenPos(
    pos: IPosition,
    { width }: Size
  ): IPosition {
    // Only use the width to calculate position, as height does not matter here.
    return {
      x: (width / 2) * pos.x - (width / 2) * pos.y,
      y: pos.x * (width / 4) + pos.y * (width / 4),
    };
  }

  /**
   * Convert an array of points to a string.
   * @param points An array of points, such as [{ x: 0, y: 0 }, { x: 10, y: 10 }]
   * @returns A string in the format "M x1 y1 L x2 y2 L x3 y3 L x4 y4"
   */
  private static pointsToString(points: IPosition[]) {
    return "M " + points.map((p) => `${p.x} ${p.y}`).join(" L ");
  }

  /**
   * Get the bounding points of each face of an isometric cube from a position and size.
   */
  public static getFacesPoints({ x, y }: IPosition, { width, height }: Size) {
    const topFace = [
      {
        x: width / 2 + x,
        y: 0 + y,
      },
      {
        x: width + x,
        y: width / 4 + y, // using width on purpose, as height shouldn't be used for the top face
      },
      {
        x: width / 2 + x,
        y: width / 2 + y, // using width on purpose, as height shouldn't be used for the top face
      },
      {
        x: 0 + x,
        y: width / 4 + y, // using width on purpose, as height shouldn't be used for the top face
      },
    ];
    const leftFace = [
      {
        x: topFace[3].x,
        y: topFace[3].y,
      },
      {
        x: topFace[3].x,
        y: topFace[3].y + height,
      },
      {
        x: topFace[0].x,
        y: topFace[2].y + height,
      },
      {
        x: topFace[2].x,
        y: topFace[2].y,
      },
    ];
    const rightFace = [
      {
        x: topFace[1].x,
        y: topFace[1].y,
      },
      {
        x: topFace[1].x,
        y: topFace[1].y + height,
      },
      {
        x: topFace[0].x,
        y: topFace[2].y + height,
      },
      {
        x: topFace[2].x,
        y: topFace[2].y,
      },
    ];

    // convert the points to a string, in the format "M x1 y1 L x2 y2 L x3 y3 L x4 y4"
    return {
      topFacePath: Isometry.pointsToString(topFace),
      leftFacePath: Isometry.pointsToString(leftFace),
      rightFacePath: Isometry.pointsToString(rightFace),
    };
  }
}
