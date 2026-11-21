import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <main>
      <h1>O meni</h1>
      <p>Student treće godine Računarskog fakulteta u Beogradu.</p>
    </main>
  );
}