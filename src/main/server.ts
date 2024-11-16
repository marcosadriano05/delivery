import { app } from "./app.ts";
import { client } from "../infra/postgres.ts";

client.connect();

await app.listen({ port: 5000 });
