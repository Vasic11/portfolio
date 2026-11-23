import { useEffect, useRef } from "react";

const gridLines = (color: string) =>
  `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`;

export function BackgroundGrid() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Samo za uređaje sa mišem: na telefonu nema kursora koji bi svetlo pratilo.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    function handleMove(event: PointerEvent) {
      el?.style.setProperty("--x", `${event.clientX}px`);
      el?.style.setProperty("--y", `${event.clientY}px`);
      el?.style.setProperty("--spot", "1");
    }

    function handleLeave() {
      el?.style.setProperty("--spot", "0");
    }

    window.addEventListener("pointermove", handleMove);
    document.documentElement.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: gridLines("var(--color-line)"), backgroundSize: "56px 56px" }}
      />
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-out"
        style={{
          opacity: "var(--spot, 0)",
          backgroundImage: gridLines("color-mix(in oklab, var(--color-accent) 55%, transparent)"),
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(circle 240px at var(--x, -999px) var(--y, -999px), black, transparent)",
        }}
      />
    </div>
  );
}
