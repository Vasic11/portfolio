import type { Project } from "../types";
import { Link } from "@tanstack/react-router";
interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="card">
      
      <h2>
        <Link to="/projects/$slug" params={{ slug: project.slug }}>
          {project.title}
        </Link>{" "}
        <small>{new Date(project.createdAt).getFullYear()}</small>
      </h2>
      {project.featured && <span>Istaknuto</span>}
      <p>{project.description}</p>

      <ul className="tags">
        {project.technologies.map(tech => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>

      <a href={project.githubUrl} target="_blank" rel="noreferrer">
        GitHub
      </a>
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noreferrer">
          Demo
        </a>
      )}
      
    </article>
  );
}