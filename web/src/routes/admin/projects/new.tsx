import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject } from "../../../api";
import { ProjectForm } from "../../../components/ProjectForm";

export const Route = createFileRoute("/admin/projects/new")({
  component: NewProjectPage,
});

function NewProjectPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate({ to: "/admin" });
    },
  });

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">Novi projekat</h2>
      {createMutation.error && <p className="mb-4 text-red-400">{createMutation.error.message}</p>}
      <ProjectForm submitLabel="Dodaj projekat" onSubmit={data => createMutation.mutateAsync(data)} />
    </div>
  );
}
