import { useEffect, useState } from "react";

/** NBSP before “Gist.” so it never wraps onto its own line after “designing”. */
const HERO_TEXT = "Tinsley is designing\u00a0Gist.";

const MS_PER_CHAR = 52;
const MS_AFTER_SPACE = 28;

export function HomePage() {
  const [shown, setShown] = useState("");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(HERO_TEXT);
      return;
    }

    let timeoutId = 0;
    let cancelled = false;

    const tick = (i: number) => {
      if (cancelled) return;
      const next = i + 1;
      setShown(HERO_TEXT.slice(0, next));
      if (next >= HERO_TEXT.length) {
        return;
      }
      const ch = HERO_TEXT[i];
      const delay = ch === " " ? MS_PER_CHAR + MS_AFTER_SPACE : MS_PER_CHAR;
      timeoutId = window.setTimeout(() => tick(next), delay);
    };

    timeoutId = window.setTimeout(() => tick(0), MS_PER_CHAR);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="home-page-shell">
      <p
        className="home-hero-headline m-0 mx-auto w-max max-w-full self-center text-center text-[clamp(1.1rem,4.2vw,2.75rem)] leading-[1.08] font-bold tracking-[-0.03em] md:text-[clamp(1.35rem,2.8vw,3rem)] md:leading-[1.06]"
        style={{ whiteSpace: "nowrap" }}
        aria-label={HERO_TEXT.replace("\u00a0", " ")}
      >
        <span aria-hidden="true" style={{ whiteSpace: "inherit" }}>
          {shown}
        </span>
      </p>
    </div>
  );
}
