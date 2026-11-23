import express, { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import cookieParser from "cookie-parser";
import { randomUUID } from "node:crypto";
import multer from "multer";
import { IMAGE_TYPES, MAX_IMAGE_MB, upload } from "./uploads.js";
import { checkPassword, clearSession, createSession, isLoggedIn, requireAuth } from "./auth.js";
import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import { imagesTable, projectsTable } from "./db/schema.js";
import { createProjectSchema, updateProjectSchema } from "./projects.js";
import { fetchPinnedRepos, getGithubInfo } from "./github.js";
import { TranslateError, translateToEnglish } from "./translate.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/uploads", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: `Pošalji sliku (PNG, JPG ili WebP, najviše ${MAX_IMAGE_MB} MB)` });
    return;
  }

  const id = `${randomUUID()}${IMAGE_TYPES[req.file.mimetype]}`;
  await db.insert(imagesTable).values({ id, contentType: req.file.mimetype, data: req.file.buffer });
  res.status(201).json({ url: `/uploads/${id}` });
});

app.get("/uploads/:id", async (req, res) => {
  const image = await db.query.imagesTable.findFirst({ where: eq(imagesTable.id, req.params.id) });
  if (!image) {
    res.status(404).json({ error: "Slika ne postoji" });
    return;
  }

  // Slika sa istim imenom se nikad ne menja (nova slika dobije novo ime), pa browser i CDN smeju da je čuvaju godinu dana.
  res.set("Content-Type", image.contentType);
  res.set("Cache-Control", "public, max-age=31536000, immutable");
  res.send(image.data);
});

const loginSchema = z.object({ password: z.string().min(1) });

app.post("/auth/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success || !(await checkPassword(result.data.password))) {
    res.status(401).json({ error: "Pogrešna lozinka" });
    return;
  }
  await createSession(res);
  res.json({ ok: true });
});

app.post("/auth/logout", (req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

app.get("/auth/me", async (req, res) => {
  res.json({ loggedIn: await isLoggedIn(req) });
});

app.get("/", (req, res) => {
  res.json({ message: "Portfolio API radi!" });
});

app.get("/projects", async (req, res) => {
  let result = await db.select().from(projectsTable);

  if (req.query.featured === "true") {
    result = result.filter(p => p.featured);
  }
  if (req.query.featured === "false") {
    result = result.filter(p => !p.featured);
  }

  const technology = req.query.technology;
  if (typeof technology === "string") {
    result = result.filter(p => p.technologies.includes(technology));
  }

  res.json(result);
});

app.get("/projects/:slug", async (req, res) => {
  const project = await db.query.projectsTable.findFirst({
    where: eq(projectsTable.slug, req.params.slug),
  });
  if (!project) {
    res.status(404).json({ error: "Projekat nije pronađen" });
    return;
  }

  const github = await getGithubInfo(project.githubUrl);
  res.json({ ...project, github });
});

app.post("/projects", requireAuth, async (req, res) => {
  const result = createProjectSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: "Neispravni podaci",
      details: z.flattenError(result.error).fieldErrors,
    });
    return;
  }

  const existing = await db.query.projectsTable.findFirst({
    where: eq(projectsTable.slug, result.data.slug),
  });
  if (existing) {
    res.status(409).json({ error: "Projekat sa tim slugom već postoji" });
    return;
  }

  const [newProject] = await db.insert(projectsTable).values(result.data).returning();
  res.status(201).json(newProject);
});

app.patch("/projects/:slug", requireAuth, async (req: Request<{ slug: string }>, res: Response) => {
  const project = await db.query.projectsTable.findFirst({
    where: eq(projectsTable.slug, req.params.slug),
  });
  if (!project) {
    res.status(404).json({ error: "Projekat nije pronađen" });
    return;
  }

  const result = updateProjectSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: "Neispravni podaci",
      details: z.flattenError(result.error).fieldErrors,
    });
    return;
  }

  const newSlug = result.data.slug;
  if (newSlug && newSlug !== project.slug) {
    const existing = await db.query.projectsTable.findFirst({
      where: eq(projectsTable.slug, newSlug),
    });
    if (existing) {
      res.status(409).json({ error: "Projekat sa tim slugom već postoji" });
      return;
    }
  }

  const [updated] = await db
    .update(projectsTable)
    .set(result.data)
    .where(eq(projectsTable.id, project.id))
    .returning();
  res.json(updated);
});

app.delete("/projects/:slug", requireAuth, async (req: Request<{ slug: string }>, res: Response) => {
  const deleted = await db
    .delete(projectsTable)
    .where(eq(projectsTable.slug, req.params.slug))
    .returning();
  if (deleted.length === 0) {
    res.status(404).json({ error: "Projekat nije pronađen" });
    return;
  }
  res.status(204).send();
});

app.get("/github/pinned", requireAuth, async (req, res) => {
  const [repos, projects] = await Promise.all([fetchPinnedRepos(), db.select().from(projectsTable)]);

  const normalize = (url: string) => url.toLowerCase().replace(/\/+$/, "");
  const existing = new Set(projects.map(p => normalize(p.githubUrl)));

  res.json(repos.map(repo => ({ ...repo, imported: existing.has(normalize(repo.url)) })));
});

const translateSchema = z.object({
  texts: z.array(z.string().max(5000)).min(1).max(10),
});

app.post("/translate", requireAuth, async (req, res) => {
  const parsed = translateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Pošalji tekstove za prevod" });
    return;
  }

  try {
    res.json({ translations: await translateToEnglish(parsed.data.texts) });
  } catch (error) {
    if (error instanceof TranslateError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    throw error;
  }
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE" ? `Slika je veća od ${MAX_IMAGE_MB} MB` : "Neispravan fajl";
    res.status(400).json({ error: message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Greška na serveru" });
});

// Lokalno pokrećemo server sami. Na Vercel-u (gde postoji promenljiva VERCEL) Vercel sam prima zahteve
// i prosleđuje ih aplikaciji koju izvozimo ispod.
if (!process.env.VERCEL) {
  app.listen(3000, () => {
    console.log("Server radi na http://localhost:3000");
  });
}

export default app;