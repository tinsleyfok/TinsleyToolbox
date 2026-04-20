import { useTheme } from "../hooks/useTheme";

/**
 * Empty phone shell for Referral entry — same frame as other /animation/* pages.
 * Add UI inside the flex-1 region when ready.
 */
export function ReferralEntryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bgColor = isDark ? "#000000" : "#F2F2F2";

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: bgColor }}>
      <div className="phone relative w-full max-w-full h-dvh md:inline-block md:w-auto md:max-w-[90vw] md:max-h-[90vh] md:h-auto">
        <img
          src={`${import.meta.env.BASE_URL}Image/Phone.png`}
          alt="Phone"
          className="hidden md:block w-full h-auto max-h-[90vh] relative z-2 pointer-events-none"
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
          <div className="flex-1 min-h-0 w-full" aria-label="Referral entry" />
        </div>
      </div>
    </div>
  );
}
