// Upisuje opise i studije slučaja (srpski + engleski) za postojeće projekte.
// Pokretanje (iz foldera server): npm run content:case-studies
// Posle toga sve tekstove možeš da menjaš kroz admin.
import { eq } from "drizzle-orm";
import { db } from "../src/db/index.js";
import { projectsTable } from "../src/db/schema.js";

const caseStudies = {
  "euro-elite": {
    description:
      "Web aplikacija u Next.js-u i TypeScriptu koja preko zvaničnog EuroLeague API-ja prikazuje statistiku igrača i učinak timova.",
    descriptionEn:
      "A Next.js and TypeScript web app that uses the official EuroLeague API to display player statistics and team performance.",
    problem:
      "Statistika EuroLeague igrača i timova je raštrkana i nije pregledna za brzu analizu. Hteo sam jedno mesto gde se podaci o igračima i timovima vide i porede na prvi pogled.",
    problemEn:
      "EuroLeague player and team stats are spread out and hard to scan quickly. I wanted one place where player and team data can be seen and compared at a glance.",
    role:
      "Samostalni projekat: povezivanje sa zvaničnim EuroLeague API-jem, obrada podataka na serveru i prikazi za analizu igrača i timova u React komponentama.",
    roleEn:
      "Solo project: integrating the official EuroLeague API, processing the data on the server and building player and team analysis views in React components.",
    lessons:
      "Naučio sam kako da radim sa spoljnim API-jem u Next.js-u i da podatke obradim na serveru pre prikaza. Najviše mi je pomoglo iskustvo iz Synergy Sports: znao sam koje brojke su zaista bitne za analizu utakmice.",
    lessonsEn:
      "I learned how to work with an external API in Next.js and process data on the server before rendering it. My experience at Synergy Sports helped the most: I knew which numbers actually matter when analyzing a game.",
  },
  graffito: {
    description:
      "Timski projekat iz Dizajna softvera: Java desktop aplikacija sa grafičkim interfejsom, izgrađena na proverenim obrascima projektovanja.",
    descriptionEn:
      "A Software Design team project: a Java desktop application with a graphical interface, built on established design patterns.",
    problem:
      "Cilj je bio napraviti desktop aplikaciju sa bogatim grafičkim interfejsom čiji je kod lak za održavanje i proširivanje, uz pravilnu primenu obrazaca projektovanja.",
    problemEn:
      "The goal was a desktop application with a rich graphical interface whose code is easy to maintain and extend, with proper use of design patterns.",
    role:
      "U timu od dvoje radio sam veći deo grafičkog interfejsa: komponente, dugmiće i akcije, i njihovo povezivanje sa logikom aplikacije. Implementirao sam undo/redo za akcije korisnika pomoću Command obrasca.",
    roleEn:
      "In a two-person team, I owned most of the graphical interface: components, buttons and actions, and connecting them to the application logic. I implemented undo/redo for user actions using the Command pattern.",
    lessons:
      "Primenili smo MVC, Observer, Composite i State obrasce. Naučio sam kako dobar dizajn olakšava dodavanje novih mogućnosti, i kako se radi na zajedničkom kodu preko Gita i GitHub Classroom-a.",
    lessonsEn:
      "We applied the MVC, Observer, Composite and State patterns. I learned how good design makes new features easier to add, and how to work on a shared codebase with Git and GitHub Classroom.",
  },
  "database-gui": {
    description:
      "Desktop aplikacija za upravljanje bazom podataka i rad sa podacima, sa grafičkim interfejsom u JavaFX-u i MVC arhitekturom.",
    descriptionEn:
      "A desktop application for database management and data manipulation, with a JavaFX graphical interface and an MVC architecture.",
    problem:
      "Rad sa bazom samo kroz SQL upite nije pristupačan svakome. Cilj je bio grafički interfejs za pregled i izmenu podataka.",
    problemEn:
      "Working with a database only through SQL queries isn't approachable for everyone. The goal was a graphical interface for viewing and editing data.",
    role: "Napravio sam interfejs u JavaFX-u i organizovao kod po Model-View-Controller arhitekturi.",
    roleEn: "I built the JavaFX interface and structured the code around the Model-View-Controller architecture.",
    lessons:
      "Kroz projekat sam video zašto je razdvajanje podataka, prikaza i logike važno: svaki deo može da se menja bez diranja ostalih.",
    lessonsEn:
      "This project showed me why separating data, presentation and logic matters: each part can change without touching the others.",
  },
  "qa-testing": {
    description: "Testiranje funkcionalnosti sajta koji je u produkciji i testovi opterećenja u Apache JMeter-u.",
    descriptionEn: "Functional testing of a live production website and load testing with Apache JMeter.",
    problem:
      "Sajt u produkciji mora da radi ispravno i kada ga koristi mnogo ljudi istovremeno. Trebalo je pronaći greške i proveriti performanse pod opterećenjem.",
    problemEn:
      "A production website has to work correctly even when many people use it at once. The task was to find defects and check performance under load.",
    role:
      "Testirao sam funkcionalnosti sajta i dokumentovao pronađene greške, a zatim pravio i pokretao testove opterećenja u JMeter-u.",
    roleEn: "I tested the site's functionality and documented the defects I found, then built and ran load tests in JMeter.",
    lessons:
      "Naučio sam kako se greške jasno opisuju da bi ih programeri lako reprodukovali, i kako se meri ponašanje sajta pod velikim saobraćajem.",
    lessonsEn:
      "I learned how to write clear defect reports that developers can reproduce, and how to measure a site's behavior under heavy traffic.",
  },
  "shell-data-pipeline": {
    description:
      "Bash sistem za paralelnu obradu velikih CSV fajlova: deli ulaz na delove, obrađuje ih istovremeno, ponavlja neuspele pokušaje, otkriva zaglavljene procese i može da nastavi posle prekida.",
    descriptionEn:
      "A Bash system for processing large CSV files in parallel: it splits the input into chunks, processes them concurrently, retries failures, detects hung processes and can resume after an interruption.",
    problem:
      "Obrada velikog fajla jednim procesom je spora, a procesi za obradu namerno padaju, zaglavljuju se i vraćaju oštećen izlaz. Pipeline je morao da preživi sve to i da i dalje da tačan rezultat.",
    problemEn:
      "Processing a large file with a single process is slow, and the worker processes deliberately crash, hang and return corrupt output. The pipeline had to survive all of it and still produce a correct result.",
    role:
      "Napisao sam orkestrator pipeline.sh: konfiguraciju, deljenje ulaza, paralelno pokretanje, nadzor procesa, ponovne pokušaje i spajanje rezultata. Generator podataka i procesor je dao predmet.",
    roleEn:
      "I wrote the pipeline.sh orchestrator: configuration, input splitting, parallel execution, process supervision, retries and result merging. The data generator and the processor were provided by the course.",
    lessons:
      "Najteže je bilo otkriti zaglavljene procese i ugasiti ih bez gubitka podataka, kao i omogućiti nastavak prekinutog rada. Naučio sam rad sa signalima, zaključavanjem i eksponencijalnim čekanjem između pokušaja.",
    lessonsEn:
      "The hardest parts were detecting hung processes and stopping them without losing data, and making interrupted runs resumable. I learned to work with signals, locking and exponential backoff between retries.",
  },
};

for (const [slug, texts] of Object.entries(caseStudies)) {
  const updated = await db.update(projectsTable).set(texts).where(eq(projectsTable.slug, slug)).returning();
  console.log(updated.length > 0 ? `✓ ${slug}` : `– ${slug} (nema ga u bazi, preskočeno)`);
}
