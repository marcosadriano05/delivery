export const env = {
  dbUser: Deno.env.get("DATABASE_USER") || "postgres",
  dbPassword: Deno.env.get("DATABASE_PASSWORD") || "postgres",
  dbHost: Deno.env.get("DATABASE_HOST") || "localhost",
  dbName: Deno.env.get("DATABASE_NAME") || "delivery",
  dbPort: Deno.env.get("DATABASE_PORT") || 5432,
};
