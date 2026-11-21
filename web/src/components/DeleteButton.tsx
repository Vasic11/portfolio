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
      <button type="button" onClick={() => setConfirming(true)} className="text-zinc-500 hover:text-red-400">
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
        className="font-medium text-red-400 hover:text-red-300"
      >
        {deleteMutation.isPending ? "Brisanje..." : "Sigurno?"}
      </button>
      <button type="button" onClick={() => setConfirming(false)} className="text-zinc-500 hover:text-white">
        Otkaži
      </button>
    </span>
  );
}