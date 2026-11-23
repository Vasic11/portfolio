import type { ReactNode } from "react";
import { motion } from "motion/react";
import { easeOut } from "../motion";

interface SectionProps {
  id: string;
  label: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
}

export function Section({ id, label, title, aside, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-24 py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="mb-10 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="font-mono text-sm text-accent">// {label}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
        </div>
        {aside}
      </motion.div>
      {children}
    </section>
  );
}
