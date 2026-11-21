import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProject, updateProject, type ProjectInput } from "../../../api";
import { ProjectForm } from "../../../components/ProjectForm";

export const Route = createFileRoute("/admin/projects/$slug/edit")({
  component: EditProjectPage,
});

function EditProjectPage() {
  const { slug } = Route.useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: project, isPending, error } = useQuery({
    queryKey: ["projects", slug],
    queryFn: () => fetchProject(slug),
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProjectInput) => updateProject(slug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate({ to: "/admin" });
    },
  });

  if (isPending) return <p className="text-zinc-500">Učitavanje...</p>;
  if (error) return <p className="text-red-400">Greška: {error.message}</p>;

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">Izmena: {project.title}</h2>
      {updateMutation.error && <p className="mb-4 text-red-400">{updateMutation.error.message}</p>}
      <ProjectForm
        submitLabel="Sačuvaj izmene"
        initialValues={{
          title: project.title,
          slug: project.slug,
          description: project.description,
          technologies: project.technologies.join(", "),
          githubUrl: project.githubUrl,
          liveUrl: project.liveUrl ?? "",
          featured: project.featured,
        }}
        onSubmit={data => updateMutation.mutateAsync(data)}
      />
    </div>
  );
}
