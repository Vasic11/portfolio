import { useLang } from "../i18n";

const lines = [
  { prompt: true, text: "whoami" },
  { prompt: false, text: "mihajlo · software engineering @ RAF" },
  { prompt: true, text: "cat work.txt" },
  { prompt: false, text: "sports data analyst @ Synergy Sports" },
  { prompt: true, text: "cat stack.txt" },
  { prompt: false, text: "TypeScript · React · TanStack" },
  { prompt: false, text: "Node.js · Express · SQLite" },
  { prompt: true, text: "status" },
];

export function HeroTerminal() {
  const { lang } = useLang();
  const status = lang === "en" ? "open to junior roles ✓" : "otvoren za junior poziciju ✓";
  return (
    <div aria-hidden="true" className="w-full max-w-md rounded-xl border border-line bg-card/80 shadow-2xl shadow-black/40 backdrop-blur">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="ml-2 font-mono text-xs text-muted/70">~/portfolio</span>
      </div>
      <div className="flex flex-col gap-1.5 p-5 font-mono text-sm">
        {lines.map((line, i) => (
          <p key={i} className={line.prompt ? "text-fg" : "text-muted"}>
            {line.prompt && <span className="mr-2 text-accent">$</span>}
            {line.text}
          </p>
        ))}
        <p className="text-accent">{status}</p>
        <p className="text-fg">
          <span className="mr-2 text-accent">$</span>
          <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-fg/80" />
        </p>
      </div>
    </div>
  );
}
