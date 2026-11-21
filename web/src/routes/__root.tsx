import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="mx-auto flex max-w-5xl gap-6 px-6 py-6 text-sm">
        <Link to="/" className="text-zinc-400 hover:text-white [&.active]:text-white">
          Početna
        </Link>
        <Link to="/about" className="text-zinc-400 hover:text-white [&.active]:text-white">
          O meni
        </Link>
      </nav>

      <div className="mx-auto max-w-5xl px-6 pb-24">
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </div>
  );
}