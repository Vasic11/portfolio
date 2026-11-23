import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/db/schema.js";
import { imagesTable, projectsTable } from "../src/db/schema.js";

// Kopira projekte i slike iz lokalne baze (portfolio.db) u Turso.
// Može da se pokrene više puta: postojeći projekti se ažuriraju po slugu, postojeće slike se preskaču.
process.loadEnvFile(".env.production");

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url || !authToken) throw new Error("U .env.production fale TURSO_DATABASE_URL ili TURSO_AUTH_TOKEN");

const local = drizzle({ connection: { url: "file:portfolio.db" }, schema });
const remote = drizzle({ connection: { url, authToken }, schema });

const projects = await local.select().from(projectsTable);
for (const { id, ...project } of projects) {
  await remote
    .insert(projectsTable)
    .values(project)
    .onConflictDoUpdate({ target: projectsTable.slug, set: project });
  console.log(`✓ projekat ${project.slug}`);
}

const images = await local.select().from(imagesTable);
for (const image of images) {
  await remote.insert(imagesTable).values(image).onConflictDoNothing();
  console.log(`✓ slika ${image.id}`);
}

console.log(`Gotovo: ${projects.length} projekata, ${images.length} slika.`);
