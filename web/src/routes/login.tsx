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
        <label className="flex flex-col gap-2 text-sm font-medium text-fg">
          Lozinka
          <input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            autoFocus
            className="rounded-lg border border-line bg-card px-4 py-2.5 font-normal text-fg outline-none transition-colors focus:border-accent"
          />
        </label>

        {loginMutation.error && <p className="text-sm text-red-500">{loginMutation.error.message}</p>}

        <button
          type="submit"
          disabled={loginMutation.isPending || password === ""}
          className="rounded-lg bg-accent px-4 py-2.5 font-medium text-bg transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {loginMutation.isPending ? "Prijavljivanje..." : "Prijavi se"}
        </button>
      </form>
    </main>
  );
}