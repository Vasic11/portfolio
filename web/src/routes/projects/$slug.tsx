import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "../../api";

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();

  const { data: project, isPending, error } = useQuery({
    queryKey: ["projects", slug],
    queryFn: () => fetchProject(slug),
  });

  if (isPending) return <p>Učitavanje...</p>;
  if (error) return <p>Greška: {error.message}</p>;

  return (
    <main>
      <Link to="/">← Nazad na projekte</Link>
      <h1>{project.title}</h1>
      <p>{project.description}</p>

      <h2>Tehnologije</h2>
      <ul>
        {project.technologies.map(tech => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>

      {project.github && (
        <>
          <h2>Sa GitHuba</h2>
          <p>
            ⭐ {project.github.stars} · poslednja izmena{" "}
            {new Date(project.github.lastPush).toLocaleDateString("sr-RS")}
          </p>
          <ul>
            {project.github.languages.map(lang => (
              <li key={lang.name}>
                {lang.name}: {lang.percent}%
              </li>
            ))}
          </ul>
        </>
      )}

      <a href={project.githubUrl} target="_blank" rel="noreferrer">
        Kod na GitHubu
      </a>
    </main>
  );
}