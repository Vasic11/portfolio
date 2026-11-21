import { Link } from "@tanstack/react-router";
import type { Project } from "../types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-600">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold">
          <Link to="/projects/$slug" params={{ slug: project.slug }} className="hover:underline">
            {project.title}
          </Link>
        </h2>
        <span className="text-sm text-zinc-500">{new Date(project.createdAt).getFullYear()}</span>
      </div>

      {project.featured && (
        <span className="w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
          Istaknuto
        </span>
      )}

      <p className="text-zinc-400">{project.description}</p>

      <ul className="flex flex-wrap gap-2">
        {project.technologies.map(tech => (
          <li key={tech} className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex gap-4 text-sm">
        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-white">
          GitHub →
        </a>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-white">
            Demo →
          </a>
        )}
      </div>
    </article>
  );
}