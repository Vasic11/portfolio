import express, { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import cookieParser from "cookie-parser";
import { mkdirSync } from "node:fs";
import multer from "multer";
import { UPLOAD_DIR, upload } from "./uploads.js";
import { checkPassword, clearSession, createSession, isLoggedIn, requireAuth } from "./auth.js";
import { eq } from "drizzle-orm";
import { db } from "./db/index.js";
import { projectsTable } from "./db/schema.js";
import { createProjectSchema, updateProjectSchema } from "./projects.js";
import { fetchPinnedRepos, getGithubInfo } from "./github.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

mkdirSync(UPLOAD_DIR, { recursive: true });
app.use("/uploads", express.static(UPLOAD_DIR));

app.post("/uploads", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Pošalji sliku (PNG, JPG ili WebP, najviše 5 MB)" });
    return;
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
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

app.patch("/projects/:slug", requireAuth, async (req: Request<{ slug: string }>, res: Response) => {  const project = await db.query.projectsTable.findFirst({
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

app.delete("/projects/:slug", requireAuth, async (req: Request<{ slug: string }>, res: Response) => {  const deleted = await db
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

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === "LIMIT_FILE_SIZE" ? "Slika je veća od 5 MB" : "Neispravan fajl";
    res.status(400).json({ error: message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Greška na serveru" });
});

app.listen(3000, () => {
  console.log("Server radi na http://localhost:3000");
});