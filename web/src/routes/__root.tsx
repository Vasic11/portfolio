import { Link, Outlet, createRootRouteWithContext, retainSearchParams } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { BackgroundGrid } from "../components/BackgroundGrid";
import { ThemeToggle } from "../components/ThemeToggle";
import { contact } from "../content";
import { useLang, type Lang } from "../i18n";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  validateSearch: (search: Record<string, unknown>): { lang?: Lang } => ({
    lang: search.lang === "en" || search.lang === "sr" ? search.lang : undefined,
  }),
  search: { middlewares: [retainSearchParams(["lang"])] },
  component: RootLayout,
});

function RootLayout() {
  const { lang, t } = useLang();

  return (
    <div className="isolate flex min-h-screen flex-col overflow-x-clip">
      <BackgroundGrid />
      <header className="sticky top-0 z-30 border-b border-line/60 bg-bg/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 text-sm">
          <Link to="/" className="font-mono font-medium text-fg">
            mihajlo<span className="text-accent">.</span>dev
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden items-center gap-6 sm:flex">
              {[
                { hash: "projekti", label: t.navProjects },
                { hash: "o-meni", label: t.navAbout },
                { hash: "kontakt", label: t.navContact },
              ].map(link => (
                <Link key={link.hash} to="/" hash={link.hash} className="text-muted transition-colors hover:text-fg">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex rounded-lg border border-line p-0.5 font-mono text-xs">
              {(["sr", "en"] as const).map(code => (
                <Link
                  key={code}
                  to="."
                  search={prev => ({ ...prev, lang: code })}
                  viewTransition
                  aria-current={lang === code ? "true" : undefined}
                  className="rounded-md px-2 py-1 text-muted uppercase transition-colors hover:text-fg aria-[current]:bg-card aria-[current]:text-fg"
                >
                  {code}
                </Link>
              ))}
            </div>

            <ThemeToggle />
          </div>
        </nav>
      </header>

      <div className="mx-auto w-full max-w-5xl flex-1 px-6">
        <Outlet />
      </div>

      <footer className="border-t border-line/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono">© {new Date().getFullYear()} Mihajlo Vasić</p>
          <div className="flex flex-wrap gap-6">
            <a href={`mailto:${contact.email}`} className="hover:text-fg">
              {contact.email}
            </a>
            <a href={contact.github} target="_blank" rel="noreferrer" className="hover:text-fg">
              GitHub
            </a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer" className="hover:text-fg">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

      <TanStackRouterDevtools />
    </div>
  );
}
