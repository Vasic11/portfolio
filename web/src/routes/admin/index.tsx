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
        <p className="text-muted">Na sajtu je {projects.length} projekata.</p>
        <Link
          to="/admin/projects/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
        >
          + Novi projekat
        </Link>
      </div>

      {isPending ? <p className="text-muted">Učitavanje...</p> : <ProjectsTable projects={projects} />}
    </div>
  );
}