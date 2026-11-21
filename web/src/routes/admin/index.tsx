import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../../api";
import { ProjectsTable } from "../../components/ProjectsTable";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { data: projects = [], isPending } = useQuery({
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

      {isPending ? <p className="text-zinc-500">Učitavanje...</p> : <ProjectsTable projects={projects} />}
    </div>
  );
}