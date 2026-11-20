import { db } from "./index.js";
import { projectsTable } from "./schema.js";
import { projects } from "../projects.js";

await db.delete(projectsTable);
await db.insert(projectsTable).values(projects);

const all = await db.select().from(projectsTable);
console.log(`Ubačeno ${all.length} projekata`);