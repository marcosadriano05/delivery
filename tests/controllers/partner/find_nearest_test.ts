import { assertEquals, describe, it } from "../../../deps/test.ts";
import { FindNearestController } from "../../../src/controllers/partner/find_nearest.ts";
import { FakePartnerRepo } from "../../mock/fake_partner_repo.ts";

const controller = new FindNearestController(new FakePartnerRepo());

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
});
