import { instantiate } from "../lib/rs_lib.generated.js";

try {
  const { is_point_in_polygon } = await instantiate();

  class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  }

  class Polygon {
    exterior: Point[];
    interiors: Point[][];

    constructor(exterior: Point[], interiors: Point[][]) {
      this.exterior = exterior;
      this.interiors = interiors;
    }
  }

  let polygon = new Polygon(
    [
      new Point(30, 20),
      new Point(45, 40),
      new Point(10, 40),
      new Point(30, 20),
    ],
    [],
  );

  console.log(is_point_in_polygon(new Point(25, 34), polygon));

  polygon = new Polygon(
    [new Point(3, 1), new Point(3, 4), new Point(7, 4), new Point(7, 1)],
    [
      [new Point(4, 3), new Point(4, 2), new Point(6, 3), new Point(6, 2)],
    ],
  );

  console.log("Um polígono interno");
  console.log(is_point_in_polygon(new Point(5, 2.5), polygon));
  console.log(is_point_in_polygon(new Point(3.5, 2), polygon));

  polygon = new Polygon(
    [new Point(1, 1), new Point(1, 4), new Point(7, 4), new Point(7, 1)],
    [
      [new Point(2, 3), new Point(2, 2), new Point(3, 2), new Point(3, 3)],
      [new Point(5, 3), new Point(5, 2), new Point(6, 3), new Point(6, 2)],
    ],
  );

  console.log("Dois pligonos internos");
  console.log(is_point_in_polygon(new Point(2.5, 2.5), polygon));
  console.log(is_point_in_polygon(new Point(5.5, 2.5), polygon));
  console.log(is_point_in_polygon(new Point(4, 2.5), polygon));
  console.log(is_point_in_polygon(new Point(4, 6), polygon));
  // console.log(is_point_in_polygon({ x: 15, y: 35 }));
  // console.log(is_point_in_polygon({ x: 30, y: 20 }));
  // console.log(is_point_in_polygon({ x: 5, y: 40 }));
  // console.log(is_point_in_polygon({ x: 10, y: 35 }));
} catch (error: any) {
  console.log("error", error);
}
