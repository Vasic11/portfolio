export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  createdAt: string;
}
export interface GithubInfo {
  stars: number;
  lastPush: string;
  topics: string[];
  languages: { name: string; percent: number }[];
}

export interface ProjectDetail extends Project {
  github: GithubInfo | null;
}