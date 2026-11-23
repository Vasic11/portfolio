import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { fetchProject } from "../../api";
import { GlowCard } from "../../components/GlowCard";
import { useLang } from "../../i18n";
import { easeOut, rise } from "../../motion";

const reveal = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -80px 0px" },
  transition: { duration: 0.5, ease: easeOut },
} as const;

const icons = {
  problem: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5M12 16.5h.01" />
    </>
  ),
  role: (
    <>
      <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13.5 6l-3 12" />
    </>
  ),
  lessons: (
    <>
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
    </>
  ),
};

function CardIcon({ name }: { name: keyof typeof icons }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/10 text-accent">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-5"
      >
        {icons[name]}
      </svg>
    </span>
  );
}

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectPage,
});

function ProjectPage() {
  const { slug } = Route.useParams();
  const { t, locale, pick } = useLang();

  const { data: project, isPending, error } = useQuery({
    queryKey: ["projects", slug],
    queryFn: () => fetchProject(slug),
  });

  const caseStudy = project
    ? [
        { icon: "problem", label: t.problem, text: pick(project, "problem") },
        { icon: "role", label: t.myRole, text: pick(project, "role") },
        { icon: "lessons", label: t.lessons, text: pick(project, "lessons") },
      ].filter((part): part is { icon: keyof typeof icons; label: string; text: string } => Boolean(part.text))
    : [];

  if (isPending) return <p className="py-24 text-muted">{t.loading}</p>;
  if (error)
    return (
      <p className="py-24 text-red-400">
        {t.error}: {error.message}
      </p>
    );

  return (
    <main className="py-16">
      <Link to="/" hash="projekti" className="font-mono text-sm text-muted transition-colors hover:text-fg">
        {t.back}
      </Link>

      <header className="mt-10">
        <motion.h1 {...rise(16)} className="text-4xl font-semibold tracking-tight sm:text-6xl">
          {project.title}
        </motion.h1>
        <motion.p {...rise(10, 0.1, 0.5)} className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {pick(project, "description")}
        </motion.p>

        <motion.div {...rise(8, 0.18, 0.5)} className="mt-8 flex flex-wrap gap-3 text-sm">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-accent px-5 py-2.5 font-medium text-bg transition-colors hover:bg-accent/90"
          >
            {t.codeOnGithub}
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-line px-5 py-2.5 transition-colors hover:border-muted/50 hover:bg-card"
            >
              {t.viewDemo}
            </a>
          )}
        </motion.div>
      </header>

      {project.imageUrl && (
        <motion.img
          {...rise(24, 0.24, 0.7)}
          src={project.imageUrl}
          alt={project.title}
          className="mt-12 aspect-video w-full rounded-2xl border border-line object-cover"
        />
      )}

      {caseStudy.length > 0 && (
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {caseStudy.map((part, index) => (
            <motion.section
              key={part.label}
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.07 }}
              // Neparan broj kartica: poslednja zauzima ceo red.
              className={index === caseStudy.length - 1 && caseStudy.length % 2 === 1 ? "md:col-span-2" : ""}
            >
              <GlowCard className="h-full p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  <CardIcon name={part.icon} />
                  <h2 className="font-mono text-sm text-accent">// {part.label}</h2>
                </div>
                <p className="mt-5 leading-relaxed whitespace-pre-line text-fg/90 sm:text-lg">{part.text}</p>
              </GlowCard>
            </motion.section>
          ))}
        </div>
      )}

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <motion.section {...reveal} className={project.github ? "" : "md:col-span-2"}>
          <GlowCard className="h-full p-6 sm:p-8">
            <h2 className="font-mono text-sm text-accent">// {t.technologies}</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <li key={tech} className="rounded-md border border-line bg-bg/60 px-3 py-1 font-mono text-sm text-muted">
                  {tech}
                </li>
              ))}
            </ul>
          </GlowCard>
        </motion.section>

        {project.github && (
          <motion.section {...reveal} transition={{ ...reveal.transition, delay: 0.07 }}>
            <GlowCard className="h-full p-6 sm:p-8">
              <h2 className="font-mono text-sm text-accent">// {t.fromGithub}</h2>
              <p className="mt-5 text-sm text-muted">
                ★ {project.github.stars} · {t.lastPush}{" "}
                {new Date(project.github.lastPush).toLocaleDateString(locale)}
              </p>

              <ul className="mt-6 flex flex-col gap-4">
                {project.github.languages.map(lang => (
                  <li key={lang.name}>
                    <div className="mb-1.5 flex justify-between font-mono text-xs">
                      <span>{lang.name}</span>
                      <span className="text-muted">{lang.percent}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-line">
                      <div className="h-1.5 rounded-full bg-accent" style={{ width: `${lang.percent}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </GlowCard>
          </motion.section>
        )}
      </div>
    </main>
  );
}
