import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

export const db = drizzle("file:portfolio.db", { schema });