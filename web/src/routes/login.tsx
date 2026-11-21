import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../api";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [password, setPassword] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.setQueryData(["me"], { loggedIn: true });
      navigate({ to: "/admin" });
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginMutation.mutate(password);
  }

  return (
    <main className="mx-auto max-w-sm py-24">
      <h1 className="text-3xl font-bold">Prijava</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm text-zinc-400">
          Lozinka
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoFocus
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-zinc-100 outline-none focus:border-zinc-400"
          />
        </label>

        {loginMutation.error && <p className="text-sm text-red-400">{loginMutation.error.message}</p>}

        <button
          type="submit"
          disabled={loginMutation.isPending || password === ""}
          className="rounded-lg bg-white px-4 py-2 font-medium text-zinc-950 hover:bg-zinc-200 disabled:opacity-50"
        >
          {loginMutation.isPending ? "Prijavljivanje..." : "Prijavi se"}
        </button>
      </form>
    </main>
  );
}