import { Client } from "../../deps/postgres.ts";
import { env } from "../../env.ts";

export const client = new Client({
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  hostname: env.dbHost,
  port: Number(env.dbPort),
});
