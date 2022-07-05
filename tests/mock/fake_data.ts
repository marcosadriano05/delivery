import { PartnerDao } from "../../src/domain/partner_repository.ts";

export const fakeData: PartnerDao[] = [{
  id: 1,
  tradingName: "trading 1",
  ownerName: "owner 1",
  document: "document 1",
  address: {
    type: "Point",
    coordinates: [10, 10],
  },
  coverageArea: {
    type: "MultPolygon",
    coordinates: [[
      [[20, 15], [20, 10], [25, 10], [25, 15], [20, 15]],
    ], [
      [[0, 20], [0, 10], [5, 10], [5, 20], [0, 20]],
    ]],
  },
}, {
  id: 2,
  tradingName: "trading 2",
  ownerName: "owner 2",
  document: "document 2",
  address: {
    type: "Point",
    coordinates: [20, 5],
  },
  coverageArea: {
    type: "MultPolygon",
    coordinates: [[[[20, 15], [20, 10], [25, 10], [25, 15], [20, 15]]]],
  },
}];