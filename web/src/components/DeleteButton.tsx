import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "../api";

export function DeleteButton({ slug }: { slug: string }) {
  const [confirming, setConfirming] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)} className="text-muted hover:text-red-500">
        Obriši
      </button>
    );
  }

  return (
    <span className="flex items-center gap-3 whitespace-nowrap">
      <button
        type="button"
        onClick={() => deleteMutation.mutate(slug)}
        disabled={deleteMutation.isPending}
        className="font-medium text-red-500 hover:text-red-600"
      >
        {deleteMutation.isPending ? "Brisanje..." : "Sigurno?"}
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="text-muted hover:text-fg">
        Otkaži
      </button>
    </span>
  );
}