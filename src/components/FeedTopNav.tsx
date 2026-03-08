import { useState, useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";

const FILTERS = ["All", "Media", "Text"] as const;

export function FeedTopNav() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [active, setActive] = useState<string>("All");
  const [hidden, setHidden] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingDown = useRef(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const down = y > lastY && y > 10;
      lastY = y;

      if (down && !isScrollingDown.current) {
        isScrollingDown.current = true;
        hideTimer.current = setTimeout(() => {
          setHidden(true);
        }, 300);
      } else if (!down) {
        isScrollingDown.current = false;
        if (hideTimer.current) {
          clearTimeout(hideTimer.current);
          hideTimer.current = null;
        }
        setHidden(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 flex items-center h-12 px-3 transition-transform duration-300"
      style={{
        background: isDark ? "#0f0f0f" : "#ffffff",
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" />

      <div className="flex-1 flex items-center justify-center gap-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className="bg-transparent border-none cursor-pointer font-rethink text-[18px] font-bold transition-opacity"
            style={{
              color: isDark ? "#ffffff" : "#000000",
              opacity: active === f ? 1 : 0.35,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <button className="w-8 h-8 flex items-center justify-center bg-transparent border-none cursor-pointer flex-shrink-0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M10.9149 1.75C15.9799 1.75002 20.0848 5.85505 20.0848 10.915C20.0848 13.09 19.3302 15.0803 18.0702 16.6553L22.5164 21.1064C22.7115 21.3017 22.7116 21.6183 22.5164 21.8135L21.8133 22.5166C21.6181 22.7118 21.3016 22.7117 21.1063 22.5166L16.6551 18.0703C15.0801 19.3303 13.0899 20.085 10.9149 20.085C5.8549 20.085 1.74987 15.98 1.74985 10.915C1.74985 5.85504 5.85489 1.75 10.9149 1.75ZM10.9149 3.75C6.95989 3.75 3.74985 6.96004 3.74985 10.915C3.74987 14.875 6.9599 18.085 10.9149 18.085C14.8749 18.0849 18.0848 14.875 18.0848 10.915C18.0848 6.96005 14.8749 3.75002 10.9149 3.75Z" fill={isDark ? "#ffffff" : "#000000"} />
        </svg>
      </button>
    </div>
  );
}
