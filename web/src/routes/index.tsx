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
      <h1>Mihajlo Vasić</h1>
      <p>Junior developer · TypeScript · React · Node.js</p>

      <button type="button" onClick={() => setOnlyFeatured(!onlyFeatured)}>
        {onlyFeatured ? "Prikaži sve" : "Samo istaknuti"}
      </button>

      {isPending && <p>Učitavanje projekata...</p>}
      {error && <p>Greška: {error.message}</p>}

      <section>
        {visible.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </main>
  );
}