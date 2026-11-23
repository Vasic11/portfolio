import { Link } from "@tanstack/react-router";
import type { Project } from "../types";
import { useLang } from "../i18n";
import { GlowCard } from "./GlowCard";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { pick } = useLang();
  return (
    <article className="h-full transition-transform duration-200 ease-out hover:-translate-y-0.5">
      <GlowCard className="flex h-full flex-col">
        <div className="aspect-video overflow-hidden border-b border-line bg-bg">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt=""
              loading="lazy"
              className="size-full object-cover transition-transform duration-300 ease-out group-hover/glow:scale-[1.02]"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] bg-size-[18px_18px] font-mono text-sm text-muted/70">
              {project.slug}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-xl font-semibold tracking-tight">
              <Link
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="after:absolute after:inset-0 after:z-20 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-accent"
              >
                {project.title}
              </Link>
            </h3>
            <span className="font-mono text-xs text-muted">{new Date(project.createdAt).getFullYear()}</span>
          </div>

          <p className="text-sm leading-relaxed text-muted">{pick(project, "description")}</p>

          <ul className="mt-auto flex flex-wrap gap-2 pt-2">
            {project.technologies.map(tech => (
              <li key={tech} className="rounded-md border border-line px-2 py-0.5 font-mono text-xs text-muted">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </GlowCard>
    </article>
  );
}
