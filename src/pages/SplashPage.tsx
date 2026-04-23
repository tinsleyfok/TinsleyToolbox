import { useRef } from "react";
import { OpeningAnimationCanvas } from "../components/OpeningAnimationCanvas";
import { useTheme } from "../hooks/useTheme";

/** Figma Feed: Gist group position (402×874) */
const GIST_LEFT_PCT = (89 / 402) * 100;
const GIST_TOP_PCT = (394 / 874) * 100;
const GIST_WIDTH_PCT = (202 / 402) * 100;

export function SplashPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const openingLayerRef = useRef<HTMLDivElement>(null);
  const openingBg = isDark ? "#000000" : "#F0EBE7";
  const gistSrc =
    theme === "dark"
      ? `${import.meta.env.BASE_URL}Gist.svg`
      : `${import.meta.env.BASE_URL}Gist_Lightmode.svg`;

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: openingBg }}>
      <div className="phone relative w-full max-w-full h-dvh md:inline-block md:w-auto md:max-w-[90vw] md:max-h-[90vh] md:h-auto">
        <img
          src={`${import.meta.env.BASE_URL}Image/Phone.png`}
          alt="Phone"
          className="hidden md:block w-auto h-auto max-w-[90vw] max-h-[90vh] relative z-2 pointer-events-none"
        />
        <div
          className="hidden md:block absolute z-0 rounded-[56px] overflow-hidden"
          style={{ top: 6, left: 6, right: 6, bottom: 6, background: openingBg }}
        />
        <div
          className="phone-container opening-phone-container flex flex-col overflow-hidden"
          data-theme={theme}
          style={{ background: openingBg }}
        >
          <div ref={openingLayerRef} className="relative flex-1 min-h-0 w-full">
            <img
              src={gistSrc}
              alt="Gist"
              className="absolute z-0 max-w-none opening-gist-fade pointer-events-none select-none"
              style={{
                left: `${GIST_LEFT_PCT}%`,
                top: `${GIST_TOP_PCT}%`,
                width: `${GIST_WIDTH_PCT}%`,
                height: "auto",
              }}
              width={202}
              height={81}
              decoding="async"
            />
            <OpeningAnimationCanvas isDark={isDark} contentLayerRef={openingLayerRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
