import { Point, Polygon } from "../domain/entities.ts";
import { Geometry } from "../domain/geometry.ts";
import init, { is_point_in_polygon } from "geo_helper";

await init();

export class GeometryWasmLib implements Geometry {
  isPointInsidePolygon(point: Point, polygon: Polygon): boolean {
    return is_point_in_polygon(point, polygon);
  }
}
