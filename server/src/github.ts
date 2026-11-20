import { z } from "zod";

const repoSchema = z.object({
  stargazers_count: z.number(),
  pushed_at: z.string(),
  topics: z.array(z.string()),
});

const languagesSchema = z.record(z.string(), z.number());

export interface GithubInfo {
  stars: number;
  lastPush: string;
  topics: string[];
  languages: { name: string; percent: number }[];
}

function parseGithubUrl(githubUrl: string) {
  const url = new URL(githubUrl);
  if (url.hostname !== "github.com") return null;

  const [owner, repo] = url.pathname.split("/").filter(Boolean);
  if (!owner || !repo) return null;

  return { owner, repo };
}


async function fetchGithubInfo(githubUrl: string): Promise<GithubInfo | null> {
  const parsed = parseGithubUrl(githubUrl);
  if (!parsed) return null;

  const base = `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`;

  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [repoRes, langRes] = await Promise.all([
      fetch(base, { headers }),
      fetch(`${base}/languages`, { headers }),
    ]);
  

    if (!repoRes.ok || !langRes.ok) {
      console.warn(`GitHub ${repoRes.status} za ${parsed.owner}/${parsed.repo}`);
      return null;
    }

    const repo = repoSchema.parse(await repoRes.json());
    const languages = languagesSchema.parse(await langRes.json());

    const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

    return {
      stars: repo.stargazers_count,
      lastPush: repo.pushed_at,
      topics: repo.topics,
      languages:
        total === 0
          ? []
          : Object.entries(languages).map(([name, bytes]) => ({
              name,
              percent: Math.round((bytes / total) * 1000) / 10,
            })),
    };
  } catch (error) {
    console.warn("GitHub nije dostupan:", error);
    return null;
  }
}


const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minuta

const cache = new Map<string, { data: GithubInfo | null; expiresAt: number }>();

export async function getGithubInfo(githubUrl: string): Promise<GithubInfo | null> {
  const cached = cache.get(githubUrl);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const data = await fetchGithubInfo(githubUrl);
  cache.set(githubUrl, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return data;
}