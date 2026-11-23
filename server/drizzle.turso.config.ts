import { defineConfig } from "drizzle-kit";

// Učitava TURSO_DATABASE_URL i TURSO_AUTH_TOKEN iz .env.production (taj fajl se ne commituje).
process.loadEnvFile(".env.production");

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url || !authToken) throw new Error("U .env.production fale TURSO_DATABASE_URL ili TURSO_AUTH_TOKEN");

export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema.ts",
  dbCredentials: { url, authToken },
});
