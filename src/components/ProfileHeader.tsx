import { useTheme } from "../hooks/useTheme";
import { AvatarImg } from "./AvatarImg";
import { tinsleyProfilePhoto } from "../utils/publicAsset";

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
    <div className="flex flex-col items-center pt-4 pb-4 px-6">
      <div className="w-[72px] h-[72px] rounded-full mb-3 overflow-hidden">
        <AvatarImg src={tinsleyProfilePhoto} alt="tinsleyfok" className="w-full h-full object-cover" />
      </div>

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

      <div className="flex gap-3 w-full max-w-[354px] px-2">
        <button
          className="flex-1 h-[38px] rounded-full font-rethink text-[14px] font-medium cursor-pointer border-none"
          style={{
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.03)",
            color: textColor,
          }}
        >
          Edit profile
        </button>
        <button
          className="flex-1 h-[38px] rounded-full font-rethink text-[14px] font-medium cursor-pointer border-none"
          style={{
            background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.03)",
            color: textColor,
          }}
        >
          Share profile
        </button>
      </div>
    </div>
  );
}
