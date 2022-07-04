import { assertEquals, describe, it } from "../../deps.ts";
import { CoverageArea, Point } from "../../src/domain/entities.ts";

const coordinates = [
  [[[30, 20], [45, 40], [10, 40], [30, 20]], [[26, 34], [34, 36], [30, 30]]],
  [[[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]],
];

const points = coordinates.map((item1) => {
  return item1.map((item2) => {
    return item2.map((item3) => new Point(item3[0], item3[1]));
  });
});

const coverageArea = new CoverageArea(points);

describe("CoverageArea", () => {
  it("should return an array of Polygons", () => {
    const firstPolygon = coverageArea.getAreas()[0];
    assertEquals(firstPolygon.exterior[0].x, 30);
    assertEquals(firstPolygon.exterior[0].y, 20);
    assertEquals(firstPolygon.exterior[2].x, 10);
    assertEquals(firstPolygon.exterior[2].y, 40);
    assertEquals(firstPolygon.interiors.length, 1);
    assertEquals(firstPolygon.interiors[0][0].x, 26);
    assertEquals(firstPolygon.interiors[0][0].y, 34);
    assertEquals(firstPolygon.interiors[0][1].x, 34);
    assertEquals(firstPolygon.interiors[0][1].y, 36);

    const secondPolygon = coverageArea.getAreas()[1];
    assertEquals(secondPolygon.exterior[0].x, 15);
    assertEquals(secondPolygon.exterior[0].y, 5);
    assertEquals(secondPolygon.exterior[3].x, 5);
    assertEquals(secondPolygon.exterior[3].y, 10);
    assertEquals(secondPolygon.interiors.length, 0);
  });
});
