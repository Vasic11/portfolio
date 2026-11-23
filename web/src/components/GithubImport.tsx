import { useQuery } from "@tanstack/react-query";
import { fetchPinnedRepos, type PinnedRepo } from "../api";

interface GithubImportProps {
  onPick: (repo: PinnedRepo) => void;
}

export function GithubImport({ onPick }: GithubImportProps) {
  const { data: repos = [], isPending, error } = useQuery({
    queryKey: ["github", "pinned"],
    queryFn: fetchPinnedRepos,
  });

  const available = repos.filter(repo => !repo.imported);

  return (
    <section className="mb-6 max-w-2xl rounded-2xl border border-line bg-card p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-fg">Uvezi sa GitHuba</h3>
      <p className="mt-1 text-sm text-muted">Klik na pinovan repo popuni formu ispod.</p>

      {isPending && <p className="mt-3 text-sm text-muted">Učitavanje pinovanih repoa...</p>}
      {error && <p className="mt-3 text-sm text-red-500">{error.message}</p>}
      {!isPending && !error && available.length === 0 && (
        <p className="mt-3 text-sm text-muted">Svi pinovani repoi su već na sajtu.</p>
      )}

      <ul className="mt-4 flex flex-wrap gap-2">
        {available.map(repo => (
          <li key={repo.url}>
            <button
              type="button"
              onClick={() => onPick(repo)}
              className="rounded-lg border border-line bg-bg px-3 py-1.5 font-mono text-sm text-fg transition-colors hover:border-accent/60"
            >
              {repo.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
