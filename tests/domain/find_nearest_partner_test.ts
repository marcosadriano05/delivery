import { assertEquals, assertRejects, describe, it } from "../../deps/test.ts";
import {
  FindNearestPartner,
  FindPartnerError,
} from "../../src/domain/find_nearest_partner.ts";
import { Point } from "../../src/domain/entities.ts";
import { GeometryWasmLib } from "../../src/infra/geometry_wasm_lib.ts";
import { FakePartnerRepo } from "../mock/fake_partner_repo.ts";

const gemoetryLib = new GeometryWasmLib();
const repo = new FakePartnerRepo();
const findNearestPartner = new FindNearestPartner(repo, gemoetryLib);

describe("FindNearestParnet", () => {
  it("should convert coordinates to points", () => {
    const coordinates = [
      [[[30, 20], [45, 40], [10, 40], [30, 20]], [
        [26, 34],
        [34, 36],
        [30, 30],
        [26, 34],
      ]],
      [[[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]],
    ];
    const pointsToMatch = [
      [[
        new Point(30, 20),
        new Point(45, 40),
        new Point(10, 40),
        new Point(30, 20),
      ], [
        new Point(26, 34),
        new Point(34, 36),
        new Point(30, 30),
        new Point(26, 34),
      ]],
      [[
        new Point(15, 5),
        new Point(40, 10),
        new Point(10, 20),
        new Point(5, 10),
        new Point(15, 5),
      ]],
    ];
    const points = findNearestPartner.coordinatesToPoints(coordinates);

    assertEquals(points, pointsToMatch);
  });

  it("should calculate the distance between two points", () => {
    const pointA = new Point(1, 1);
    const pointB = new Point(3, 1);
    const distance = findNearestPartner.distanceBetweenTwoPoints(
      pointA,
      pointB,
    );

    assertEquals(distance, 2);
  });

  it("should return the nearest partner", async () => {
    let partner = await findNearestPartner.exec(23, 12);

    assertEquals(partner.address.coordinates[0], 20);
    assertEquals(partner.address.coordinates[1], 5);

    partner = await findNearestPartner.exec(3, 15);

    assertEquals(partner.address.coordinates[0], 10);
    assertEquals(partner.address.coordinates[1], 10);
  });

  it("should throw an error if no partner cover the address", () => {
    assertRejects(
      () => findNearestPartner.exec(15, 15),
      FindPartnerError,
      "No partner cover this address.",
    );
  });
});
