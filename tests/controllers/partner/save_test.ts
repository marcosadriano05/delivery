import {
  assertEquals,
  describe,
  it,
  returnsNext,
  stub,
} from "../../../deps/test.ts";
import { SaveController } from "../../../src/controllers/partner/save.ts";
import { FakePartnerRepo } from "../../mock/fake_partner_repo.ts";

const repo = new FakePartnerRepo();
const controller = new SaveController(repo);

describe("Save partner controller", () => {
  it("should return status 400 if no body is provided", async () => {
    const response = await controller.handle({});

    assertEquals(response.statusCode, 400);
    assertEquals(
      response.body.message,
      "Body params required: tradingName, ownerName, document, address, coverageArea.",
    );
  });

  it("should return status 400 if at least one param is missing", async () => {
    const response = await controller.handle({
      body: {
        ownerName: "owner",
        document: "document",
        address: {
          type: "type",
          coordinates: [10, 10],
        },
        coverageArea: {
          type: "type",
          coordinates: [[[[10, 10], [10, 10]]]],
        },
      },
    });

    assertEquals(response.statusCode, 400);
    assertEquals(
      response.body.message,
      "Body params required: tradingName, ownerName, document, address, coverageArea.",
    );
  });

  it("should return status 400 if param who must be string don't", async () => {
    const response = await controller.handle({
      body: {
        tradingName: 10,
        ownerName: "owner",
        document: "document",
        address: {
          type: "type",
          coordinates: [10, 10],
        },
        coverageArea: {
          type: "type",
          coordinates: [[[[10, 10], [10, 10]]]],
        },
      },
    });

    assertEquals(response.statusCode, 400);
    assertEquals(
      response.body.message,
      "Body params should be strings: tradingName, ownerName, document.",
    );
  });

  it("should return status 400 if address param is missing properties", async () => {
    const response = await controller.handle({
      body: {
        tradingName: "trading",
        ownerName: "owner",
        document: "document",
        address: {},
        coverageArea: {
          type: "type",
          coordinates: [[[[10, 10], [10, 10]]]],
        },
      },
    });

    assertEquals(response.statusCode, 400);
    assertEquals(
      response.body.message,
      "Body params required to address: type, coordinates.",
    );
  });

  it("should return status 400 if address or coverage type param is not string", async () => {
    const response = await controller.handle({
      body: {
        tradingName: "trading",
        ownerName: "owner",
        document: "document",
        address: {
          type: 10,
          coordinates: [10, 10],
        },
        coverageArea: {
          type: "type",
          coordinates: [[[[10, 10], [10, 10]]]],
        },
      },
    });

    assertEquals(response.statusCode, 400);
    assertEquals(
      response.body.message,
      "Body params type to address should be string.",
    );
  });

  it("should return status 400 if address coordinates param is not number[]", async () => {
    const response = await controller.handle({
      body: {
        tradingName: "trading",
        ownerName: "owner",
        document: "document",
        address: {
          type: "type",
          coordinates: "a",
        },
        coverageArea: {
          type: "type",
          coordinates: [[[[10, 10], [10, 10]]]],
        },
      },
    });

    assertEquals(response.statusCode, 400);
    assertEquals(
      response.body.message,
      "Body param address.coordinates must be empty array or an array of numbers.",
    );
  });

  it("should return status 400 if coverage coordinates param is not number[][][][]", async () => {
    const response = await controller.handle({
      body: {
        tradingName: "trading",
        ownerName: "owner",
        document: "document",
        address: {
          type: "type",
          coordinates: [10, 10],
        },
        coverageArea: {
          type: "type",
          coordinates: [[[[10, 10], [10, 10]]], [[["10", 10], [10, 10]]]],
        },
      },
    });

    assertEquals(response.statusCode, 400);
    assertEquals(
      response.body.message,
      "Body param coverageArea.coordinates must be empty array or an number[][][][].",
    );
  });

  it("should return status 500 if save throws", async () => {
    const saveStub = stub(
      repo,
      "save",
      returnsNext([new Promise((resolve, reject) => reject(null))]),
    );

    const response = await controller.handle({
      body: {
        tradingName: "trading",
        ownerName: "owner",
        document: "document",
        address: {
          type: "type",
          coordinates: [10, 10],
        },
        coverageArea: {
          type: "type",
          coordinates: [[[[10, 10], [10, 10]]], [[[10, 10], [10, 10]]]],
        },
      },
    });

    try {
      assertEquals(response.statusCode, 500);
      assertEquals(response.body.message, "Server error.");
    } finally {
      saveStub.restore();
    }
  });

  it("should return status 201 if save is successful", async () => {
    const response = await controller.handle({
      body: {
        tradingName: "trading",
        ownerName: "owner",
        document: "document",
        address: {
          type: "type",
          coordinates: [10, 10],
        },
        coverageArea: {
          type: "type",
          coordinates: [[[[10, 10], [10, 10]]], [[[10, 10], [10, 10]]]],
        },
      },
    });

    assertEquals(response.statusCode, 201);
    assertEquals(response.body.message, "Partner created.");
  });
});
