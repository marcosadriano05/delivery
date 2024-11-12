import {
  assertEquals,
  describe,
  it,
  returnsNext,
  stub,
} from "../../../deps/test.ts";
import { FindAllController } from "../../../src/controllers/partner/find_all.ts";
import { FakePartnerRepo } from "../../mock/fake_partner_repo.ts";

const repo = new FakePartnerRepo();
const controller = new FindAllController(repo);

describe("Find all partners controller", () => {
  it("should return status 404 if no partners are returned", async () => {
    const getAllStub = stub(
      repo,
      "getAll",
      returnsNext([new Promise((resolve) => resolve([]))]),
    );

    const response = await controller.handle({});

    try {
      assertEquals(response.statusCode, 404);
      assertEquals(
        response.body.message,
        "No partners found.",
      );
    } finally {
      getAllStub.restore();
    }
  });

  it("should return status 500 if getAll throws", async () => {
    const getAllStub = stub(
      repo,
      "getAll",
      returnsNext([new Promise((_resolve, reject) => reject([]))]),
    );

    const response = await controller.handle({});

    try {
      assertEquals(response.statusCode, 500);
      assertEquals(
        response.body.message,
        "Server error.",
      );
    } finally {
      getAllStub.restore();
    }
  });

  it("should return status 200 if partners are found", async () => {
    const response = await controller.handle({});

    assertEquals(response.statusCode, 200);
    assertEquals(response.body.length, 2);
    assertEquals(response.body[0].id, 1);
    assertEquals(response.body[1].id, 2);
  });
});
