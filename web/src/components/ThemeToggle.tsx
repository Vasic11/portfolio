import { useState } from "react";
import { flushSync } from "react-dom";
import { useLang } from "../i18n";

type Theme = "dark" | "light";

export function ThemeToggle() {
  const { t } = useLang();
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";

    function apply() {
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {
        // Ako browser ne dozvoljava localStorage, tema i dalje radi, samo se ne pamti.
      }
      // flushSync: React odmah iscrta novu ikonicu, da bi browser uslikao gotovu novu stranicu.
      flushSync(() => setTheme(next));
    }

    // Stariji browseri nemaju startViewTransition, kod njih se tema samo promeni.
    if (document.startViewTransition) document.startViewTransition(apply);
    else apply();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? t.themeToLight : t.themeToDark}
      title={theme === "dark" ? t.themeToLight : t.themeToDark}
      className="grid size-9 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-muted/50 hover:text-fg"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="size-4">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}
