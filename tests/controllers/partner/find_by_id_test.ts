import {
  assertEquals,
  describe,
  it,
  returnsNext,
  stub,
} from "../../../deps/test.ts";
import { FindByIdController } from "../../../src/controllers/partner/find_by_id.ts";
import { FakePartnerRepo } from "../../mock/fake_partner_repo.ts";

const repo = new FakePartnerRepo();
const controller = new FindByIdController(repo);

describe("Find by id partner controller", () => {
  it("should return status 400 if id is not a number format", async () => {
    const response = await controller.handle({
      params: {
        id: "a",
      },
    });

    assertEquals(response.statusCode, 400);
    assertEquals(
      response.body.message,
      "Id param should have a number format.",
    );
  });

  it("should return status 404 if no partner is found", async () => {
    const getByIdStub = stub(
      repo,
      "getById",
      returnsNext([new Promise((resolve) => resolve(null))]),
    );

    const response = await controller.handle({
      params: {
        id: 1,
      },
    });

    try {
      assertEquals(response.statusCode, 404);
      assertEquals(
        response.body.message,
        "Partner not found.",
      );
    } finally {
      getByIdStub.restore();
    }
  });

  it("should return status 500 getById throws", async () => {
    const getByIdStub = stub(
      repo,
      "getById",
      returnsNext([new Promise((_resolve, reject) => reject(null))]),
    );

    const response = await controller.handle({
      params: {
        id: 1,
      },
    });

    try {
      assertEquals(response.statusCode, 500);
      assertEquals(response.body.message, "Server error.");
    } finally {
      getByIdStub.restore();
    }
  });

  it("should return status 200 if getById returns a partner", async () => {
    const response = await controller.handle({
      params: {
        id: 1,
      },
    });

    assertEquals(response.statusCode, 200);
    assertEquals(response.body.id, 1);
  });
});
