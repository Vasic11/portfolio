import { z } from "zod";

export const projectFormSchema = z.object({
  title: z.string().min(1, "Naslov je obavezan"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Samo mala slova, brojevi i crtice"),
  description: z.string().min(10, "Opis mora imati bar 10 karaktera"),
  technologies: z.string().min(1, "Navedi bar jednu tehnologiju"),
  githubUrl: z.url("Neispravan link"),
  liveUrl: z.union([z.literal(""), z.url("Neispravan link")]),
  featured: z.boolean(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;