import { Outlet, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMe, logout } from "../api";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ context }) => {
    const me = await context.queryClient.fetchQuery({ queryKey: ["me"], queryFn: fetchMe });
    if (!me.loggedIn) {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["me"], { loggedIn: false });
      navigate({ to: "/" });
    },
  });

  return (
    <main className="py-12">
      <div className="flex items-center justify-between border-b border-line pb-6">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <button
          type="button"
          onClick={() => logoutMutation.mutate()}
          className="rounded-lg border border-line px-4 py-2 text-sm text-muted transition-colors hover:bg-card hover:text-fg"
        >
          Odjavi se
        </button>
      </div>

      <div className="mt-8">
        <Outlet />
      </div>
    </main>
  );
}