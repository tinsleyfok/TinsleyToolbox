import { useEffect, useState } from "react";

const HERO_TEXT = "Tinsley is designing Gist.";

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
        className="home-hero-headline m-0 max-w-[min(100%,22rem)] text-center text-[clamp(1.35rem,5.5vw,2.75rem)] leading-[1.08] font-bold tracking-[-0.03em] sm:max-w-[min(100%,26rem)] md:text-[clamp(1.75rem,3.2vw,3rem)] md:leading-[1.06]"
        aria-label={HERO_TEXT}
      >
        <span aria-hidden="true">{shown}</span>
      </p>
    </div>
  );
}
