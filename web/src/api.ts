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