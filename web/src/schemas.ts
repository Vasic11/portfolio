import { z } from "zod";

export const projectFormSchema = z.object({
  title: z.string().min(1, "Naslov je obavezan"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Samo mala slova, brojevi i crtice"),
  description: z.string().min(10, "Opis mora imati bar 10 karaktera"),
  technologies: z.string().min(1, "Navedi bar jednu tehnologiju"),
  githubUrl: z.url("Neispravan link"),
  liveUrl: z.union([z.literal(""), z.url("Neispravan link")]),
  imageUrl: z.string(),
  problem: z.string().max(2000, "Najviše 2000 karaktera"),
  role: z.string().max(2000, "Najviše 2000 karaktera"),
  lessons: z.string().max(2000, "Najviše 2000 karaktera"),
  descriptionEn: z.string().max(2000, "Najviše 2000 karaktera"),
  problemEn: z.string().max(2000, "Najviše 2000 karaktera"),
  roleEn: z.string().max(2000, "Najviše 2000 karaktera"),
  lessonsEn: z.string().max(2000, "Najviše 2000 karaktera"),
  featured: z.boolean(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;