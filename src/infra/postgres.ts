import pg from "pg";
import { env } from "../../env.ts";

export const client = new pg.Client({
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName,
  hostname: env.dbHost,
  port: Number(env.dbPort),
});
