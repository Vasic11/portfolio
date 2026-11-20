import express from "express";
import { z } from "zod";
import { projects, createProjectSchema, updateProjectSchema, type Project } from "./projects.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Portfolio API radi!" });
});


app.get("/projects", (req, res) => {
  let result = projects;

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



app.get("/projects/:slug", (req, res) => {
  const project = projects.find(p => p.slug === req.params.slug);
  if (!project) {
    res.status(404).json({ error: "Projekat nije pronađen" });
    return;
  }
  res.json(project);
});



app.post("/projects", (req, res) => {
  const result = createProjectSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Neispravni podaci",
      details: z.flattenError(result.error).fieldErrors,
    });
    return;
  }

  if (projects.some(p => p.slug === result.data.slug)) {
    res.status(409).json({ error: "Projekat sa tim slugom već postoji" });
    return;
  }

  const newId = Math.max(0, ...projects.map(p => p.id)) + 1;
  const newProject: Project = {
    ...result.data,
    id: newId,
    createdAt: new Date(),
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

app.patch("/projects/:slug", (req, res) => {
  const project = projects.find(p => p.slug === req.params.slug);
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
  if (newSlug && projects.some(p => p.slug === newSlug && p.id !== project.id)) {
    res.status(409).json({ error: "Projekat sa tim slugom već postoji" });
    return;
  }

  Object.assign(project, result.data);
  res.json(project);
});

app.delete("/projects/:slug", (req, res) => {
  const index = projects.findIndex(p => p.slug === req.params.slug);
  if (index === -1) {
    res.status(404).json({ error: "Projekat nije pronađen" });
    return;
  }

  projects.splice(index, 1);
  res.status(204).send();
});


app.listen(3000, () => {
  console.log("Server radi na http://localhost:3000");
});

