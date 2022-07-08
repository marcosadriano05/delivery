import { Point, Polygon } from "../../src/domain/entities.ts";
import { Geometry } from "../../src/domain/geometry.ts";

export class FakeGeometryLib implements Geometry {
  isPointInsidePolygon(point: Point, polygon: Polygon): boolean {
    return true;
  }
}
