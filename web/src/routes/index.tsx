import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { GlowCard } from "../components/GlowCard";
import { HeroTerminal } from "../components/HeroTerminal";
import { ProjectCard } from "../components/ProjectCard";
import { Section } from "../components/Section";
import { fetchProjects } from "../api";
import { about, contact, techGroups, timeline } from "../content";
import { useLang } from "../i18n";
import { easeOut, rise } from "../motion";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const cardDelays = [0, 0.08, 0.14, 0.18];
const reveal = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -80px 0px" },
  transition: { duration: 0.5, ease: easeOut },
} as const;

const secondaryButton =
  "rounded-lg border border-line px-5 py-2.5 text-sm transition-colors hover:border-muted/50 hover:bg-card";

function HomePage() {
  const { lang, t } = useLang();
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const { data: projects = [], isPending, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const visible = onlyFeatured ? projects.filter(p => p.featured) : projects;

  return (
    <main>
      <section className="relative flex min-h-[78vh] items-center py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 left-0 -z-10 size-96 rounded-full bg-accent/15 blur-3xl"
        />

        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="font-mono text-sm text-accent"
            >
              // {t.heroLabel}
            </motion.p>

            <motion.h1 {...rise(16)} className="mt-4 text-5xl font-bold tracking-tight sm:text-7xl">
              Mihajlo Vasić
            </motion.h1>

            <motion.p {...rise(10, 0.1, 0.5)} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {t.heroText}
            </motion.p>

            <motion.div {...rise(8, 0.18, 0.5)} className="mt-10 flex flex-wrap gap-3">
              <a
                href="#projekti"
                className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
              >
                {t.heroCta}
              </a>
              <a href="#kontakt" className={secondaryButton}>
                {t.heroContact}
              </a>
            </motion.div>
          </div>

          <motion.div {...rise(20, 0.26, 0.7)} className="hidden justify-end lg:flex">
            <HeroTerminal />
          </motion.div>
        </div>
      </section>

      <Section
        id="projekti"
        label={t.projectsLabel}
        title={t.projectsTitle}
        aside={
          <div className="flex rounded-lg border border-line p-1 text-sm">
            {[
              { label: t.filterAll, value: false },
              { label: t.filterFeatured, value: true },
            ].map(option => (
              <button
                key={option.label}
                type="button"
                aria-pressed={onlyFeatured === option.value}
                onClick={() => setOnlyFeatured(option.value)}
                className="rounded-md px-4 py-1.5 text-muted transition-colors hover:text-fg aria-pressed:bg-card aria-pressed:text-fg"
              >
                {option.label}
              </button>
            ))}
          </div>
        }
      >
        {isPending && <p className="text-muted">{t.loading}</p>}
        {error && (
          <p className="text-red-400">
            {t.error}: {error.message}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {visible.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -80px 0px" }}
              transition={{ duration: 0.5, delay: cardDelays[index] ?? 0.2, ease: easeOut }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="o-meni" label={t.aboutLabel} title={t.aboutTitle}>
        <motion.ol {...reveal} className="relative flex max-w-3xl flex-col gap-6">
          <span aria-hidden="true" className="absolute top-3 bottom-3 left-[7px] w-px bg-line" />
          {timeline[lang].map(item => (
            <li key={item.title} className="relative pl-10">
              <span
                aria-hidden="true"
                className="absolute top-7 left-0 size-[15px] rounded-full border-2 border-accent bg-bg shadow-[0_0_0_4px_var(--color-bg)]"
              />
              <GlowCard className="p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <span className="font-mono text-xs text-accent">{item.period}</span>
                </div>
                <p className="mt-3 leading-relaxed text-muted">{item.detail}</p>
              </GlowCard>
            </li>
          ))}
        </motion.ol>
      </Section>

      <Section id="tehnologije" label={t.techLabel} title={t.techTitle}>
        <motion.div {...reveal} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {techGroups[lang].map(group => (
            <GlowCard key={group.name} className="p-6">
              <h3 className="text-lg font-semibold">{group.name}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map(item => (
                  <li key={item} className="rounded-md border border-line px-2.5 py-1 font-mono text-xs text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </GlowCard>
          ))}
        </motion.div>
      </Section>

      <Section id="kontakt" label={t.contactLabel} title={t.contactTitle}>
        <motion.div {...reveal}>
          <GlowCard className="p-8 sm:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-accent/15 blur-3xl"
            />
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              {t.contactText}
            </p>
            <ul className="mt-6 flex flex-col gap-1 font-mono text-sm text-muted">
              <li>{about[lang].location}</li>
              <li>{about[lang].languages}</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-accent/90"
                >
                  {t.sendEmail}
                </a>
              )}
              {contact.cvUrl && (
                <a href={contact.cvUrl} download className={secondaryButton}>
                  {t.downloadCv}
                </a>
              )}
              <a href={contact.linkedin} target="_blank" rel="noreferrer" className={secondaryButton}>
                LinkedIn
              </a>
              <a href={contact.github} target="_blank" rel="noreferrer" className={secondaryButton}>
                GitHub
              </a>
            </div>
          </GlowCard>
        </motion.div>
      </Section>
    </main>
  );
}
