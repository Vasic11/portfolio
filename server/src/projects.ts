import { z } from "zod";
export interface Project{
    id: number;
    slug: string;
    title: string;
    description: string;
    technologies: string[];
    githubUrl: string;
    liveUrl?:  string | undefined;
    featured: boolean;
    createdAt: Date;
}
// Dodaj i projekat iz Sel-a i Razvoj softvera
export const createProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug sme da sadrži samo mala slova, brojeve i crtice"),
  title: z.string().min(1, "Naslov je obavezan"),
  description: z.string().min(10, "Opis mora imati bar 10 karaktera"),
  technologies: z.array(z.string()).min(1, "Navedi bar jednu tehnologiju"),
  githubUrl: z.url("Neispravan GitHub link"),
  liveUrl: z.url("Neispravan demo link").optional(),
  imageUrl: z.string().startsWith("/uploads/").nullable().optional(),
  problem: z.string().max(2000).nullable().optional(),
  role: z.string().max(2000).nullable().optional(),
  lessons: z.string().max(2000).nullable().optional(),
  descriptionEn: z.string().max(2000).nullable().optional(),
  problemEn: z.string().max(2000).nullable().optional(),
  roleEn: z.string().max(2000).nullable().optional(),
  lessonsEn: z.string().max(2000).nullable().optional(),
  featured: z.boolean().default(false),
});

export const updateProjectSchema = createProjectSchema
  .extend({ featured: z.boolean() })
  .partial();

export const projects: Project[] = [
    {
        id: 1,
        slug: "euro-elite",
        title: "Euro Elite",
        description: 
        "Web aplikacija koja preko EuroLeague API-ja prikazuje statistiku igrača i učinak timova.",
        technologies: ["TypeScript", "Next.js", "React"],
        githubUrl: "https://github.com/Vasic11/euro-elite",
        featured: true,
        createdAt: new Date("2026-01-01"),
    },
    {
        id: 2,
        slug: "graffito",
        title: "Graffito",
        description: 
        "Timski projekat iz Dizajna softvera. OVDE NAPIŠI ŠTA APLIKACIJA RADI I ŠTA JE BIO TVOJ DEO.",
        technologies: ["Java"],
        githubUrl: "https://github.com/RAF-DSW-2025-26/dsw-projekat-2025-tim_mihajlovasic_nevenamiletic",
        featured: true,
        createdAt: new Date("2025-12-01"),
    },
    {
        id: 3,
        slug: "database-gui",
        title: "Database Manager",
        description:
        "Desktop aplikacija za upravljanje bazom podataka sa grafičkim interfejsom, napravljena po MVC arhitekturi.",
        technologies: ["Java", "JavaFX", "SQL"],
        githubUrl: "https://github.com/Vasic11/database-fundamentals-project",
        featured: true,
        createdAt: new Date("2025-06-01"),
    },
    {
        id: 4,
        slug: "qa-testing",
        title: "QA testiranje sajta",
        description:
        "Testiranje sajta gresnik.com i testovi opterećenja u JMeter-u.",
        technologies: ["Python", "JMeter"],
        githubUrl: "https://github.com/Vasic11/QA-Testin",
        featured: false,
        createdAt: new Date("2025-04-01"),
   },
   {
        id: 5,
        slug: "shell-data-pipeline",
        title: "Shell Data Pipeline",
        description:
            "Bash sistem za paralelnu obradu velikih CSV fajlova: deli ulaz na delove, obrađuje ih istovremeno, ponavlja neuspele pokušaje, otkriva zaglavljene procese i može da nastavi posle prekida.",
        technologies: ["Bash", "Linux", "Python"],
        githubUrl: "https://github.com/Vasic11/shell-data-pipeline",
        featured: true,
        createdAt: new Date("2026-11-01"),
    },

]
