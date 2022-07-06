import { instantiate } from "../../lib/rs_lib.generated.js";
const { is_point_in_polygon } = await instantiate();

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Polygon {
  exterior: Point[];
  interiors: Point[][];

  constructor(exterior: Point[], interiors: Point[][]) {
    this.exterior = exterior;
    this.interiors = interiors;
  }
}

export enum GeometryType {
  Point = "Point",
  MultiPolygon = "MultiPolygon",
}

export class Address {
  id?: number;
  type: GeometryType;
  coordinates: Point;

  constructor(lat: number, lon: number) {
    this.type = GeometryType.Point;
    this.coordinates = new Point(lat, lon);
  }
}

export class CoverageArea {
  id?: number;
  type: GeometryType;
  coordinates: Point[][][];
  areas: Polygon[];

  constructor(coordinates: Point[][][]) {
    this.type = GeometryType.MultiPolygon;
    this.coordinates = coordinates;
    this.areas = this.getAreas();
  }

  getAreas(): Polygon[] {
    return this.coordinates.map((polygon) => {
      let exterior: Point[] = [];
      const interiors: Point[][] = [];
      polygon.forEach((value, index) => {
        if (index === 0) {
          exterior = value.map((item) => new Point(item.x, item.y));
        } else {
          interiors.push(value.map((item) => new Point(item.x, item.y)));
        }
      });
      return new Polygon(exterior, interiors);
    });
  }

  isAddressIn(address: Address): boolean {
    return this.areas.some((area) =>
      is_point_in_polygon(address.coordinates, area)
    );
  }
}

export class Partner {
  id?: number;

  constructor(
    public tradingName: string,
    public ownerName: string,
    public document: string,
    public coverageArea: CoverageArea,
    public address: Address,
  ) {}
}
