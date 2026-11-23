import { useEffect } from "react";
import { useSearch } from "@tanstack/react-router";
import type { Project } from "./types";

export type Lang = "sr" | "en";

export const dictionary = {
  sr: {
    navProjects: "Projekti",
    navAbout: "O meni",
    navContact: "Kontakt",
    heroLabel: "software engineering student · full-stack",
    heroText:
      "Student treće godine Softverskog inženjerstva na RAF-u i sports data analyst u Synergy Sports. Pravim web aplikacije od baze do interfejsa, u TypeScriptu, Reactu i Node.js-u.",
    heroCta: "Pogledaj projekte",
    heroContact: "Kontakt",
    projectsLabel: "projekti",
    projectsTitle: "Na čemu sam radio",
    filterAll: "Svi",
    filterFeatured: "Istaknuti",
    loading: "Učitavanje...",
    error: "Greška",
    aboutLabel: "o meni",
    aboutTitle: "Iskustvo i obrazovanje",
    techLabel: "tehnologije",
    techTitle: "Sa čim radim",
    contactLabel: "kontakt",
    contactTitle: "Hajde da sarađujemo",
    contactText:
      "Tražim poziciju junior software engineera ili praksu, idealno u web razvoju. Ako imaš priliku ili samo hoćeš da pogledaš neki moj projekat zajedno, javi se.",
    sendEmail: "Pošalji email",
    downloadCv: "Preuzmi CV",
    back: "← nazad na projekte",
    codeOnGithub: "Kod na GitHubu",
    viewDemo: "Pogledaj demo",
    problem: "problem",
    myRole: "moja uloga",
    lessons: "izazovi i šta sam naučio",
    technologies: "tehnologije",
    fromGithub: "sa githuba",
    lastPush: "poslednja izmena",
    themeToLight: "Uključi svetlu temu",
    themeToDark: "Uključi tamnu temu",
  },
  en: {
    navProjects: "Projects",
    navAbout: "About",
    navContact: "Contact",
    heroLabel: "software engineering student · full-stack",
    heroText:
      "Third-year Software Engineering student at RAF and sports data analyst at Synergy Sports. I build web apps from the database to the interface, with TypeScript, React and Node.js.",
    heroCta: "View projects",
    heroContact: "Contact",
    projectsLabel: "projects",
    projectsTitle: "Things I've built",
    filterAll: "All",
    filterFeatured: "Featured",
    loading: "Loading...",
    error: "Error",
    aboutLabel: "about",
    aboutTitle: "Experience and education",
    techLabel: "tech",
    techTitle: "What I work with",
    contactLabel: "contact",
    contactTitle: "Let's work together",
    contactText:
      "I'm looking for a junior software engineer role or an internship, ideally in web development. If you have an opportunity, or just want to walk through one of my projects together, get in touch.",
    sendEmail: "Send email",
    downloadCv: "Download CV",
    back: "← back to projects",
    codeOnGithub: "Code on GitHub",
    viewDemo: "View demo",
    problem: "problem",
    myRole: "my role",
    lessons: "challenges and what I learned",
    technologies: "tech",
    fromGithub: "from github",
    lastPush: "last push",
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
  },
} satisfies Record<Lang, Record<string, string>>;

function detectLang(): Lang {
  const browser = navigator.language.toLowerCase();
  return ["sr", "hr", "bs", "me"].some(code => browser.startsWith(code)) ? "sr" : "en";
}

export function useLang() {
  const search = useSearch({ strict: false }) as { lang?: Lang };
  const lang: Lang = search.lang ?? detectLang();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return {
    lang,
    t: dictionary[lang],
    locale: lang === "en" ? "en-US" : "sr-RS",
    pick: (project: Project, field: "description" | "problem" | "role" | "lessons") => {
      const english = project[`${field}En`];
      return lang === "en" && english ? english : project[field];
    },
  };
}
