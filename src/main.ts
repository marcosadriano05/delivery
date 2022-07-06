import { PostgresRepository } from "./infra/postgres_repository.ts";
import { client } from "./infra/postgres.ts";
import { PartnerDao } from "./domain/partner_repository.ts";

const repo = new PostgresRepository(client);
const partner: PartnerDao = {
  id: 0,
  ownerName: "owner",
  tradingName: "trading",
  document: "document",
  address: {
    type: "Point",
    coordinates: [10, 10],
  },
  coverageArea: {
    type: "MultiPolygon",
    coordinates: [[[[10, 10], [20, 20]]]],
  },
};

async function abc() {
  await client.connect();
  await repo.save(partner);
  await client.end();
}
abc();
