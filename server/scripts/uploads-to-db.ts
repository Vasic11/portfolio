import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { db } from "../src/db/index.js";
import { imagesTable } from "../src/db/schema.js";

// Jednokratno: slike iz foldera uploads/ prebacuje u tabelu images.
// Ime fajla postaje id, pa adrese /uploads/<ime> u projektima ostaju iste.
const contentTypes: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

let files: string[] = [];
try {
  files = readdirSync("uploads");
} catch {
  console.log("Nema foldera uploads/, nema šta da se prebaci.");
}

for (const file of files) {
  const contentType = contentTypes[path.extname(file).toLowerCase()];
  if (!contentType) continue;

  await db
    .insert(imagesTable)
    .values({ id: file, contentType, data: readFileSync(path.join("uploads", file)) })
    .onConflictDoNothing();
  console.log(`✓ ${file}`);
}

console.log("Gotovo.");
