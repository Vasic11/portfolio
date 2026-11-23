import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

// Na Vercel-u baza je na Turso-u (TURSO_DATABASE_URL), a lokalno je to fajl portfolio.db.
const url = process.env.TURSO_DATABASE_URL ?? "file:portfolio.db";
const authToken = process.env.TURSO_AUTH_TOKEN;

export const db = drizzle({
  connection: authToken ? { url, authToken } : { url },
  schema,
});
