import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, type PinnedRepo } from "../../../api";
import { GithubImport } from "../../../components/GithubImport";
import { ProjectForm } from "../../../components/ProjectForm";
import type { ProjectFormValues } from "../../../schemas";

export const Route = createFileRoute("/admin/projects/new")({
  component: NewProjectPage,
});

function repoToFormValues(repo: PinnedRepo): ProjectFormValues {
  return {
    title: repo.name,
    slug: repo.slug,
    description: repo.description,
    technologies: repo.languages.join(", "),
    githubUrl: repo.url,
    liveUrl: repo.homepageUrl,
    imageUrl: "",
    featured: false,
  };
}

function NewProjectPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [pickedRepo, setPickedRepo] = useState<PinnedRepo | null>(null);

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["github", "pinned"] });
      navigate({ to: "/admin" });
    },
  });

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">Novi projekat</h2>

      <GithubImport onPick={setPickedRepo} />

      {createMutation.error && <p className="mb-4 text-red-400">{createMutation.error.message}</p>}
      <ProjectForm
        key={pickedRepo?.url ?? "empty"}
        initialValues={pickedRepo ? repoToFormValues(pickedRepo) : undefined}
        submitLabel="Dodaj projekat"
        onSubmit={data => createMutation.mutateAsync(data)}
      />
    </div>
  );
}
