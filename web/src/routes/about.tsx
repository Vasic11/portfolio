import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="py-16">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">O meni</h1>
      <div className="mt-6 flex max-w-2xl flex-col gap-4 text-lg text-zinc-400">
        <p>Student treće godine Računarskog fakulteta u Beogradu, smer Softversko inženjerstvo.</p>
        <p>Radio sam u Javi, Pythonu i C-u, a sada pravim web aplikacije u TypeScriptu, Reactu i Node.js-u.</p>
      </div>
    </main>
  );
}