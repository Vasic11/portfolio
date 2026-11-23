import { sqliteTable, integer, text, blob } from "drizzle-orm/sqlite-core";

export const projectsTable = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  technologies: text("technologies", { mode: "json" }).$type<string[]>().notNull(),
  githubUrl: text("github_url").notNull(),
  liveUrl: text("live_url"),
  imageUrl: text("image_url"),
  problem: text("problem"),
  role: text("role"),
  lessons: text("lessons"),
  descriptionEn: text("description_en"),
  problemEn: text("problem_en"),
  roleEn: text("role_en"),
  lessonsEn: text("lessons_en"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

// Slike čuvamo u bazi, jer Vercel nema trajan disk: sve što funkcija upiše u fajl nestaje.
// id je ime iz adrese slike: /uploads/<id>, na primer "3f2a....png".
export const imagesTable = sqliteTable("images", {
  id: text("id").primaryKey(),
  contentType: text("content_type").notNull(),
  data: blob("data", { mode: "buffer" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});
