import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "../components/ProjectCard";
import { fetchProjects } from "../api";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const { data: projects = [], isPending, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const visible = onlyFeatured ? projects.filter(p => p.featured) : projects;

  return (
    <main>
      <header className="py-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Mihajlo Vasić</h1>
        <p className="mt-4 text-lg text-zinc-400">Junior developer · TypeScript · React · Node.js</p>
      </header>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Projekti</h2>
        <button
          type="button"
          onClick={() => setOnlyFeatured(!onlyFeatured)}
          className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800"
        >
          {onlyFeatured ? "Prikaži sve" : "Samo istaknuti"}
        </button>
      </div>

      {isPending && <p className="text-zinc-500">Učitavanje projekata...</p>}
      {error && <p className="text-red-400">Greška: {error.message}</p>}

      <section className="grid gap-6 md:grid-cols-2">
        {visible.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </main>
  );
}