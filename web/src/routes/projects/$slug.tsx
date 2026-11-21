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

  if (isPending) return <p className="py-16 text-zinc-500">Učitavanje...</p>;
  if (error) return <p className="py-16 text-red-400">Greška: {error.message}</p>;

  return (
    <main className="py-12">
      <Link to="/" className="text-sm text-zinc-500 hover:text-white">
        ← Nazad na projekte
      </Link>

      <header className="mt-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{project.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">{project.description}</p>

        <div className="mt-6 flex gap-4 text-sm">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-white px-4 py-2 font-medium text-zinc-950 hover:bg-zinc-200"
          >
            Kod na GitHubu
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-zinc-700 px-4 py-2 hover:bg-zinc-800"
            >
              Pogledaj demo
            </a>
          )}
        </div>
      </header>

      <section className="mt-12">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">Tehnologije</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map(tech => (
            <li key={tech} className="rounded-md bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
              {tech}
            </li>
          ))}
        </ul>
      </section>

      {project.github && (
        <section className="mt-12">
          <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">Sa GitHuba</h2>
          <p className="mt-4 text-zinc-400">
            ⭐ {project.github.stars} · poslednja izmena{" "}
            {new Date(project.github.lastPush).toLocaleDateString("sr-RS")}
          </p>

          <ul className="mt-6 flex max-w-md flex-col gap-4">
            {project.github.languages.map(lang => (
              <li key={lang.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{lang.name}</span>
                  <span className="text-zinc-500">{lang.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div className="h-2 rounded-full bg-emerald-400" style={{ width: `${lang.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}