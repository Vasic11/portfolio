// Sav tekst o tebi je na jednom mestu, na oba jezika: menjaj slobodno, sajt se sam prilagodi.
import type { Lang } from "./i18n";

export const contact = {
  email: "mihajlovasic186@gmail.com",
  github: "https://github.com/Vasic11",
  linkedin: "https://www.linkedin.com/in/mihajlo-vasic-raf",
  // Kad staviš PDF u web/public (npr. web/public/Mihajlo_Vasic_CV.pdf), upiši putanju: "/Mihajlo_Vasic_CV.pdf"
  cvUrl: "",
};

export const about: Record<Lang, { location: string; languages: string }> = {
  sr: {
    location: "Pančevo / Beograd · otvoren za rad na daljinu",
    languages: "Srpski: maternji · Engleski: profesionalni nivo",
  },
  en: {
    location: "Pančevo / Belgrade, Serbia · open to remote work",
    languages: "Serbian: native · English: professional working proficiency",
  },
};

interface TimelineItem {
  period: string;
  title: string;
  detail: string;
}

export const timeline: Record<Lang, TimelineItem[]> = {
  sr: [
    {
      period: "01/2023 – danas",
      title: "Synergy Sports · Sports Data Analyst (P1.5 Logger)",
      detail:
        "Honorarno, na daljinu, u međunarodnom timu. Beležim kompletnu statistiku košarkaških utakmica, napad po napad: poene, skokove, asistencije, izgubljene lopte, faulove i slobodna bacanja. Utakmice američke koledž košarke, NBA i omladinskih liga (Nike, Adidas 3SSB, Under Armour), uz stroge standarde tačnosti i rokove.",
    },
    {
      period: "10/2023 – očekivano 06/2028",
      title: "Računarski fakultet (RAF) · Softversko inženjerstvo",
      detail:
        "Osnovne studije, treća godina. Strukture podataka i algoritmi, objektno orijentisano programiranje, baze podataka, dizajn softvera i računarske mreže.",
    },
    {
      period: "2022 – 2023",
      title: "ITAcademy · Python Development",
      detail: "Završen program za Python razvoj: osnove programiranja, objektno orijentisani pristup i rad sa podacima.",
    },
  ],
  en: [
    {
      period: "01/2023 – present",
      title: "Synergy Sports · Sports Data Analyst (P1.5 Logger)",
      detail:
        "Part-time and remote, in an international team. I log complete basketball game statistics possession by possession: points, rebounds, assists, turnovers, fouls and free throws. Games from US college basketball, the NBA and youth circuits (Nike, Adidas 3SSB, Under Armour), under strict accuracy standards and deadlines.",
    },
    {
      period: "10/2023 – expected 06/2028",
      title: "School of Computing (RAF) · BSc Software Engineering",
      detail:
        "Third year. Data structures and algorithms, object-oriented programming, database systems, software design and computer networks.",
    },
    {
      period: "2022 – 2023",
      title: "ITAcademy · Python Development",
      detail: "Completed a Python development program: programming fundamentals, object-oriented design and working with data.",
    },
  ],
};

export const techGroups: Record<Lang, { name: string; items: string[] }[]> = {
  sr: [
    { name: "Frontend", items: ["TypeScript", "JavaScript", "React", "Next.js", "TanStack Router", "TanStack Query", "Tailwind CSS"] },
    { name: "Backend", items: ["Node.js", "Express", "REST API", "GraphQL", "Zod", "Drizzle ORM"] },
    { name: "Baze podataka", items: ["PostgreSQL", "MySQL", "SQLite", "SQL"] },
    { name: "Jezici", items: ["Java", "Python", "C", "Bash"] },
    { name: "Softverski dizajn", items: ["OOP", "MVC", "Command", "Observer", "Composite", "State", "Clean Code"] },
    { name: "Alati i praksa", items: ["Git", "GitHub", "Vite", "IntelliJ IDEA", "Apache JMeter", "Agile", "QA i load testing"] },
  ],
  en: [
    { name: "Frontend", items: ["TypeScript", "JavaScript", "React", "Next.js", "TanStack Router", "TanStack Query", "Tailwind CSS"] },
    { name: "Backend", items: ["Node.js", "Express", "REST API", "GraphQL", "Zod", "Drizzle ORM"] },
    { name: "Databases", items: ["PostgreSQL", "MySQL", "SQLite", "SQL"] },
    { name: "Languages", items: ["Java", "Python", "C", "Bash"] },
    { name: "Software design", items: ["OOP", "MVC", "Command", "Observer", "Composite", "State", "Clean Code"] },
    { name: "Tools and practice", items: ["Git", "GitHub", "Vite", "IntelliJ IDEA", "Apache JMeter", "Agile", "QA and load testing"] },
  ],
};
