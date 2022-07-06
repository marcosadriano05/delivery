import { Client } from "../../deps/postgres.ts";

export const client = new Client({
  user: "postgres",
  password: "postgres",
  database: "delivery",
  hostname: "localhost",
  port: 5432,
});
