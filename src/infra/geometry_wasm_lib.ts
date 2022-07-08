import { Point, Polygon } from "../domain/entities.ts";
import { Geometry } from "../domain/geometry.ts";
import { instantiate } from "../../lib/rs_lib.generated.js";
const { is_point_in_polygon } = await instantiate();

export class GeometryWasmLib implements Geometry {
  isPointInsidePolygon(point: Point, polygon: Polygon): boolean {
    return is_point_in_polygon(point, polygon);
  }
}
