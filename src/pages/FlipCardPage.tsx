import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { IconLike, IconComment, IconBookmark, IconMore, IconShare } from "../components/Icons";

const ORANGE = "#EC652B";
const BROWN_BAR = "#9E462B";
const MONA_LISA_BLUR_BG = "#DDC1A7";
const FRONT_IMAGE_URL = `${import.meta.env.BASE_URL}flip-card-front.png`;

function IconBack({ size = 24, color = "#000" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FlipCardPage() {
  const { theme } = useTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const isDark = theme === "dark";
  const bgColor = isDark ? "#000000" : "#F2F2F2";
  const textColor = isDark ? "#FFFFFF" : "#000000";
  const engagementBtnBg = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.03)";
  const mediaFallback = isDark ? "#2F2C2A" : "#F0EBE7";

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: bgColor }}>
      <div className="phone relative w-full max-w-full h-dvh md:inline-block md:w-auto md:max-w-[90vw] md:max-h-[90vh] md:h-auto">
        <img
          src={`${import.meta.env.BASE_URL}Image/Phone.png`}
          alt="Phone"
          className="hidden md:block w-auto h-auto max-w-[90vw] max-h-[90vh] relative z-2 pointer-events-none"
        />
        <div
          className="hidden md:block absolute z-0 rounded-[56px] overflow-hidden"
          style={{ top: 6, left: 6, right: 6, bottom: 6, background: bgColor }}
        />
        <div
          className="phone-container flex flex-col overflow-hidden"
          data-theme={theme}
          style={{ background: bgColor }}
        >
          {/* Header – profile + name centered; safe area + 8px so content clears notch */}
          <header
            className="flex-shrink-0 relative flex items-center justify-between px-3 pb-2"
            style={{
              minHeight: 48,
              paddingTop: "max(8px, env(safe-area-inset-top, 44px))",
            }}
          >
            <button type="button" className="w-10 h-10 flex items-center justify-center flex-shrink-0 z-10" aria-label="Back">
              <IconBack size={20} color={textColor} />
            </button>
            <div
              className="absolute left-1/2 top-1/2 flex items-center gap-1.5 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: ORANGE }} />
              <span
                className="text-[16px] font-bold font-rethink leading-[1.3]"
                style={{ color: textColor }}
              >
                AestheticGist
              </span>
            </div>
            <div className="flex items-center gap-0.5 z-10">
              <button type="button" className="w-10 h-10 flex items-center justify-center" aria-label="More">
                <IconMore size={20} color={textColor} />
              </button>
              <button type="button" className="w-10 h-10 flex items-center justify-center" aria-label="Share">
                <IconShare size={20} color={textColor} />
              </button>
            </div>
          </header>

          {/* Content area: 3D flip card – Figma: Content y=63, Media 8px horizontal, 56px from top, 386×648, radius 36 */}
          <div className="flex-1 min-h-0 relative mx-2 mt-0" style={{ perspective: "1200px" }}>
            <div
              className="absolute inset-0 transition-transform duration-500 ease-in-out"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front face: media (Mona Lisa with earphones image) */}
              <div
                className="absolute inset-0 flex flex-col rounded-[36px] overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  background: mediaFallback,
                }}
              >
                <img
                  src={FRONT_IMAGE_URL}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Back face: Mona Lisa info card – brown bar pinned to bottom */}
              <div
                className="absolute inset-0 flex flex-col rounded-[36px] overflow-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div
                  className="absolute inset-0 -m-1"
                  style={{
                    background: MONA_LISA_BLUR_BG,
                    backdropFilter: "blur(100px)",
                    WebkitBackdropFilter: "blur(100px)",
                  }}
                />
                <p
                  className="relative z-[1] px-6 pt-6 pb-0 font-charter font-bold text-[20px] leading-[1.8] flex-1 min-h-0 overflow-auto"
                  style={{ color: "#000000", paddingBottom: 96 }}
                >
                  The Mona Lisa, painted by Leonardo da Vinci, is a portrait of a woman seated calmly against a
                  distant, dreamlike landscape. Her gentle posture and softly folded hands create a sense of
                  balance and serenity, while her famous smile appears subtle and ever-changing, giving the
                  painting an air of mystery. Da Vinci’s use of delicate shading and smooth transitions between
                  light and shadow makes her face appear lifelike and expressive.
                </p>
                <div
                  className="absolute bottom-0 left-0 right-0 z-10 flex items-center px-4"
                  style={{ background: BROWN_BAR, height: 96 }}
                >
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <span className="font-rethink font-bold text-[18px] leading-[1.4] text-white tracking-[0.01em]">
                      c. 1503–1506
                    </span>
                    <span className="font-rethink text-[16px] leading-[1.8]" style={{ color: "rgba(255, 255, 255, 0.64)" }}>
                      TIME
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                    <span className="font-rethink font-bold text-[18px] leading-tight text-white tracking-[0.01em]">
                      High Renaissance
                      <br />
                      portrait
                    </span>
                    <span className="font-rethink text-[16px] leading-[1.8]" style={{ color: "rgba(255, 255, 255, 0.64)" }}>
                      portrait
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement – Figma: padding 12px 24px, gap 8px, buttons h 40, rounded 36, Flip 82.5×40 rounded 32 */}
          <div
            className="flex-shrink-0 flex items-center gap-2 py-3"
            style={{ paddingLeft: 24, paddingRight: 24 }}
          >
            <EngagementButton icon={<IconComment size={20} color={textColor} />} count="198" bg={engagementBtnBg} />
            <EngagementButton icon={<IconLike size={20} color={textColor} />} count="2" bg={engagementBtnBg} />
            <EngagementButton icon={<IconBookmark size={20} color={textColor} />} count="2.2k" bg={engagementBtnBg} />
            <div className="flex-1 min-w-0" />
            <button
              type="button"
              onClick={() => setIsFlipped((f) => !f)}
              className="flex items-center justify-center h-10 w-16 rounded-[32px] font-rethink font-medium text-[14px] text-white cursor-pointer border-0 flex-shrink-0"
              style={{ background: ORANGE }}
            >
              Flip
            </button>
          </div>

          {/* Home indicator spacer */}
          <div className="flex-shrink-0 h-[34px] md:h-2" />
        </div>
      </div>
    </div>
  );
}

function EngagementButton({
  icon,
  count,
  bg,
}: {
  icon: React.ReactNode;
  count: string;
  bg: string;
}) {
  const { theme } = useTheme();
  const textColor = theme === "dark" ? "#FFFFFF" : "#000000";

  return (
    <button
      type="button"
      className="flex items-center justify-center gap-1 h-10 w-16 rounded-[36px] font-rethink font-medium text-[14px] border-0 cursor-pointer flex-shrink-0"
      style={{
        background: bg,
        color: textColor,
      }}
    >
      {icon}
      <span>{count}</span>
    </button>
  );
}
