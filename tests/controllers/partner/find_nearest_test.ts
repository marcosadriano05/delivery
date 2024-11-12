import {
  assertEquals,
  describe,
  it,
  returnsNext,
  stub,
} from "../../../deps/test.ts";
import { FindNearestController } from "../../../src/controllers/partner/find_nearest.ts";
import { FakePartnerRepo } from "../../mock/fake_partner_repo.ts";
import { FakeGeometryLib } from "../../mock/fake_geometry_lib.ts";

const repo = new FakePartnerRepo();
const geometryLib = new FakeGeometryLib();
const controller = new FindNearestController(repo, geometryLib);

describe("Find nearest partner controller", () => {
  it("should return status 400 if no lat or lon body params are provided", async () => {
    let response = await controller.handle({});
    assertEquals(response.statusCode, 400);
    assertEquals(response.body.message, "Body params missing: lat, lon.");
    response = await controller.handle({
      body: { lat: 10 },
    });
    assertEquals(response.statusCode, 400);
    assertEquals(response.body.message, "Body params missing: lon.");
    response = await controller.handle({
      body: { lon: 10 },
    });
    assertEquals(response.statusCode, 400);
    assertEquals(response.body.message, "Body params missing: lat.");
  });

  it("should return status 400 if lat or lon body params are not numbers", async () => {
    const response = await controller.handle({
      body: { lat: 10, lon: "10" },
    });
    assertEquals(response.statusCode, 400);
    assertEquals(
      response.body.message,
      "Body params lat and lon must be numbers.",
    );
  });

  it("should return status 500 getAll throws", async () => {
    const getAllStub = stub(
      repo,
      "getAll",
      returnsNext([new Promise((_resolve, reject) => reject(null))]),
    );

    const response = await controller.handle({
      body: {
        lat: 10,
        lon: 10,
      },
    });

    try {
      assertEquals(response.statusCode, 500);
      assertEquals(response.body.message, "Server error.");
    } finally {
      getAllStub.restore();
    }
  });

  it("should return status 404 getAll throws FindPartnerError", async () => {
    const getAllStub = stub(
      repo,
      "getAll",
      returnsNext([new Promise((resolve) => resolve([]))]),
    );

    const response = await controller.handle({
      body: {
        lat: 10,
        lon: 10,
      },
    });

    try {
      assertEquals(response.statusCode, 404);
      assertEquals(response.body.message, "No partner cover this address.");
    } finally {
      getAllStub.restore();
    }
  });
});
