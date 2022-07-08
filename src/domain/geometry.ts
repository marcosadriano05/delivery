import { Point, Polygon } from "./entities.ts";

export interface Geometry {
  isPointInsidePolygon: (point: Point, polygon: Polygon) => boolean;
}
