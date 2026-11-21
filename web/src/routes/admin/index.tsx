import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../../api";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-zinc-400">Na sajtu je {projects.length} projekata.</p>
        <Link
          to="/admin/projects/new"
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-200"
        >
          + Novi projekat
        </Link>
      </div>

      <ul className="divide-y divide-zinc-800 rounded-xl border border-zinc-800">
        {projects.map(project => (
          <li key={project.id} className="flex items-center justify-between px-5 py-4">
            <span>{project.title}</span>
            <Link
              to="/admin/projects/$slug/edit"
              params={{ slug: project.slug }}
              className="text-sm text-zinc-400 hover:text-white"
            >
              Izmeni
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
