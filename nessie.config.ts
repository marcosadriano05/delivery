import { ClientPostgreSQL, NessieConfig } from "./deps/nessie.ts";
import { env } from "./env.ts";

const client = new ClientPostgreSQL({
  database: env.dbName,
  hostname: env.dbHost,
  port: Number(env.dbPort),
  user: env.dbUser,
  password: env.dbPassword,
});

const config: NessieConfig = {
  client,
  migrationFolders: ["./db/migrations"],
  seedFolders: ["./db/seeds"],
};

export default config;
