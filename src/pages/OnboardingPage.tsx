import { useRef, useState } from "react";
import { Bubble } from "../components/Bubble";
import { useTheme } from "../hooks/useTheme";
import { useBubblePhysics } from "../hooks/useBubblePhysics";

const INTERESTS = [
  { emoji: "💼", label: "Career &<br>Growth" },
  { emoji: "🐶", label: "Pets &<br>Animals" },
  { emoji: "🏠", label: "Home &<br>Living" },
  { emoji: "🧘", label: "Health &<br>Wellness" },
  { emoji: "🍽", label: "Food &<br>Drink" },
  { emoji: "🎨", label: "Culture &<br>Arts" },
  { emoji: "❤️", label: "Relationships &<br>Family" },
  { emoji: "💰", label: "Wealth &<br>Finance" },
];

export function OnboardingPage() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const [settled, setSettled] = useState(false);

  useBubblePhysics({ containerRef, onSettled: () => setSettled(true) });

  const handleToggle = (selected: boolean) => {
    setSelectedCount((c) => c + (selected ? 1 : -1));
  };

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      <div className="phone relative w-full max-w-full h-dvh md:inline-block md:w-auto md:max-w-[90vw] md:max-h-[90vh] md:h-auto">
        <img
          src={`${import.meta.env.BASE_URL}Image/Phone.png`}
          alt="Phone"
          className="hidden md:block w-full h-auto max-h-[90vh] relative z-2 pointer-events-none"
        />
        <div
          className="phone-container"
          data-theme={theme}
          style={{ background: isDark ? "#000" : "#fff" }}
        >
          <header
            className={`absolute top-[12px] left-0 right-0 h-11 flex items-center justify-end px-5 z-5 pointer-events-none transition-opacity duration-350 ${
              settled ? "opacity-100" : "opacity-0"
            }`}
          >
            <span
              className={`text-sm font-normal font-rethink cursor-pointer pr-4 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {selectedCount > 0 ? "Next" : "Skip"}
            </span>
          </header>

          <h1
            className={`absolute top-[194px] left-0 right-0 m-0 px-[8%] text-[32px] font-semibold leading-[1.2] font-rethink text-center z-5 pointer-events-none transition-opacity duration-350 ${
              settled ? "opacity-100" : "opacity-0"
            } ${isDark ? "text-white" : "text-black"}`}
          >
            Choose your interests
          </h1>

          <div
            ref={containerRef}
            className="absolute left-[4%] right-[4%] bottom-[4%] h-full overflow-hidden pointer-events-auto"
          >
            {INTERESTS.map((item) => (
              <Bubble
                key={item.emoji}
                emoji={item.emoji}
                label={item.label}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
