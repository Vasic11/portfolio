import type { Project, ProjectDetail } from "./types";

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects");
  if (!res.ok) {
    throw new Error(`Server je vratio grešku ${res.status}`);
  }
  return res.json();
}

export async function fetchProject(slug: string): Promise<ProjectDetail> {
  const res = await fetch(`/api/projects/${slug}`);
  if (!res.ok) {
    throw new Error(res.status === 404 ? "Projekat ne postoji" : `Server je vratio grešku ${res.status}`);
  }
  return res.json();
}

export async function fetchMe(): Promise<{ loggedIn: boolean }> {
  const res = await fetch("/api/auth/me");
  if (!res.ok) {
    throw new Error(`Server je vratio grešku ${res.status}`);
  }
  return res.json();
}

export async function login(password: string): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    throw new Error(res.status === 401 ? "Pogrešna lozinka" : `Server je vratio grešku ${res.status}`);
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export interface ProjectInput {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  featured: boolean;
}

async function sendProject(url: string, method: "POST" | "PATCH", data: ProjectInput): Promise<Project> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error("Nisi prijavljen");
  if (res.status === 409) throw new Error("Projekat sa tim slugom već postoji");
  if (!res.ok) throw new Error(`Server je vratio grešku ${res.status}`);
  return res.json();
}

export function createProject(data: ProjectInput) {
  return sendProject("/api/projects", "POST", data);
}

export function updateProject(slug: string, data: ProjectInput) {
  return sendProject(`/api/projects/${slug}`, "PATCH", data);
}