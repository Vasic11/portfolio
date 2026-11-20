import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const projectsTable = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  technologies: text("technologies", { mode: "json" }).$type<string[]>().notNull(),
  githubUrl: text("github_url").notNull(),
  liveUrl: text("live_url"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});