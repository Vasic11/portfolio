export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string | null;
  imageUrl: string | null;
  problem: string | null;
  role: string | null;
  lessons: string | null;
  descriptionEn: string | null;
  problemEn: string | null;
  roleEn: string | null;
  lessonsEn: string | null;
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