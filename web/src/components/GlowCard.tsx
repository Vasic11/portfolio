import type { PointerEvent, ReactNode } from "react";

function trackPointer(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--cx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--cy", `${event.clientY - rect.top}px`);
}

const glow =
  "radial-gradient(360px circle at var(--cx) var(--cy), color-mix(in oklab, var(--color-accent) 12%, transparent), transparent 70%)";
const borderGlow = "radial-gradient(220px circle at var(--cx) var(--cy), var(--color-accent), transparent 70%)";

interface GlowCardProps {
  className?: string;
  children: ReactNode;
}

export function GlowCard({ className = "", children }: GlowCardProps) {
  return (
    <div
      onPointerMove={trackPointer}
      className={`group/glow relative overflow-hidden rounded-2xl border border-line bg-card ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 ease-out group-hover/glow:opacity-100"
        style={{ background: glow }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-2xl p-px opacity-0 transition-opacity duration-300 ease-out group-hover/glow:opacity-100"
        style={{ background: borderGlow, mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)" }}
      />
      {children}
    </div>
  );
}
