import { PostgresRepository } from "../infra/postgres_repository.ts";
import { client } from "../infra/postgres.ts";
import { PartnerDao } from "../domain/partner_repository.ts";
import { json, opine } from "../../deps/opine.ts";
import { router } from "./routes.ts";

const app = opine();

app.use(json());
app.use(router);

export { app };

// const repo = new PostgresRepository(client);
// const partner: PartnerDao = {
//   id: 0,
//   ownerName: "owner",
//   tradingName: "trading",
//   document: "document",
//   address: {
//     id: 0,
//     type: "Point",
//     coordinates: [10, 10],
//   },
//   coverageArea: {
//     id: 0,
//     type: "MultiPolygon",
//     coordinates: [[[[10, 10], [20, 20]]]],
//   },
// };
