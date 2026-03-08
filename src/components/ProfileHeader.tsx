import { useTheme } from "../hooks/useTheme";

const STATS = [
  { value: "98", label: "Following" },
  { value: "2.2k", label: "Followers" },
  { value: "2.8k", label: "Impact" },
];

export function ProfileHeader() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textColor = isDark ? "#ffffff" : "#000000";
  const subtleColor = isDark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.48)";

  return (
    <div className="flex flex-col items-center pt-6 pb-4 px-6">
      <div
        className="w-[72px] h-[72px] rounded-full mb-3"
        style={{ background: isDark ? "#2a2a2a" : "#e0e0e0" }}
      />

      <h2 className="font-rethink text-[20px] font-bold m-0 mb-3" style={{ color: textColor }}>
        tinsleyfok
      </h2>

      <div className="flex items-center gap-6 mb-3">
        {STATS.map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <span className="font-rethink text-[20px] font-bold" style={{ color: textColor }}>
              {s.value}
            </span>
            <span className="font-rethink text-[14px]" style={{ color: subtleColor }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <p className="font-rethink text-[14px] m-0 mb-4" style={{ color: textColor }}>
        Designing something fun
      </p>

      <div className="flex gap-3 w-full max-w-[354px]">
        <button
          className="flex-1 h-[38px] rounded-full font-rethink text-[14px] font-medium cursor-pointer border-none"
          style={{
            background: isDark ? "#ffffff" : "#000000",
            color: isDark ? "#000000" : "#ffffff",
          }}
        >
          Edit profile
        </button>
        <button
          className="flex-1 h-[38px] rounded-full font-rethink text-[14px] font-medium cursor-pointer"
          style={{
            background: "transparent",
            color: textColor,
            border: `1.5px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}`,
          }}
        >
          Share profile
        </button>
      </div>
    </div>
  );
}
