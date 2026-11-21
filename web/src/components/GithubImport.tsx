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
    <section className="mb-10 rounded-xl border border-zinc-800 p-5">
      <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500">Uvezi sa GitHuba</h3>

      {isPending && <p className="mt-3 text-sm text-zinc-500">Učitavanje pinovanih repoa...</p>}
      {error && <p className="mt-3 text-sm text-red-400">{error.message}</p>}
      {!isPending && !error && available.length === 0 && (
        <p className="mt-3 text-sm text-zinc-500">Svi pinovani repoi su već na sajtu.</p>
      )}

      <ul className="mt-3 flex flex-wrap gap-2">
        {available.map(repo => (
          <li key={repo.url}>
            <button
              type="button"
              onClick={() => onPick(repo)}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm hover:border-zinc-400 hover:bg-zinc-800"
            >
              {repo.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
