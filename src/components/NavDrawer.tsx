import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useTheme } from "../hooks/useTheme";

interface NavItem {
  to: string;
  icon: string;
  label: string;
  children?: { to: string; icon: string; label: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", icon: "🏠", label: "Home" },
  { to: "/app", icon: "📁", label: "App" },
  {
    to: "/animation",
    icon: "📁",
    label: "Animation",
    children: [{ to: "/animation/onboarding", icon: "📄", label: "Onboarding" }],
  },
  { to: "/inspiration", icon: "📁", label: "Inspiration" },
];

export function NavDrawer() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
        className={`fixed top-1.5 left-4 z-[1200] w-10 h-10 border-none rounded-[10px] cursor-pointer flex flex-col items-center justify-center gap-[5px] p-0 transition-shadow ${
          isDark
            ? "bg-[#2c2c2c] shadow-[0_2px_10px_rgba(0,0,0,0.4)] hover:bg-[#353535]"
            : "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
        }`}
      >
        <span className={`block w-[18px] h-0.5 rounded-sm ${isDark ? "bg-[#ebebeb]" : "bg-[#37352f]"}`} />
        <span className={`block w-[18px] h-0.5 rounded-sm ${isDark ? "bg-[#ebebeb]" : "bg-[#37352f]"}`} />
        <span className={`block w-[18px] h-0.5 rounded-sm ${isDark ? "bg-[#ebebeb]" : "bg-[#37352f]"}`} />
      </button>

      {/* Overlay */}
      <div
        className={`nav-overlay ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer */}
      <nav className={`nav-drawer ${open ? "open" : ""} ${isDark ? "!bg-[#202020]" : ""}`}>
        <div className="flex-1 flex flex-col">
        {NAV_ITEMS.map((item, i) => {
          const isActive = pathname === item.to;
          return (
            <div key={item.to}>
              {i === 1 && (
                <>
                  <div className={`h-px my-2 ${isDark ? "bg-[rgba(255,255,255,0.07)]" : "bg-[rgba(55,53,47,0.06)]"}`} />
                  <div className={`text-[11px] font-semibold uppercase tracking-wider px-3 mb-2 ${isDark ? "text-[#5a5a5a]" : "text-[#b4b4b0]"}`}>
                    Folders
                  </div>
                </>
              )}
              <Link
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg no-underline text-[15px] transition-colors ${
                  isActive
                    ? isDark
                      ? "bg-[rgba(255,255,255,0.06)] font-semibold text-[#ebebeb]"
                      : "bg-[rgba(55,53,47,0.06)] font-semibold text-[#37352f]"
                    : isDark
                      ? "text-[#9b9b9b] hover:bg-[rgba(255,255,255,0.04)]"
                      : "text-[#787774] hover:bg-[rgba(55,53,47,0.04)]"
                }`}
              >
                <span className="text-lg leading-none">{item.icon}</span>{" "}
                {item.label}
              </Link>
              {item.children && (
                <div className="flex flex-col mt-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-2.5 py-2 pl-9 pr-3 rounded-lg no-underline text-[13px] transition-colors ${
                        pathname === child.to
                          ? isDark
                            ? "bg-[rgba(255,255,255,0.06)] font-semibold text-[#ebebeb]"
                            : "bg-[rgba(55,53,47,0.06)] font-semibold text-[#37352f]"
                          : isDark
                            ? "text-[#5a5a5a] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#9b9b9b]"
                            : "text-[#b4b4b0] hover:bg-[rgba(55,53,47,0.04)] hover:text-[#787774]"
                      }`}
                    >
                      <span className="text-lg leading-none">{child.icon}</span>{" "}
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        </div>

        <div className={`relative flex p-1 rounded-xl ${isDark ? "bg-[rgba(255,255,255,0.05)]" : "bg-[rgba(55,53,47,0.04)]"}`}>
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-[10px] transition-all duration-300 ease-in-out ${
              isDark
                ? "left-[calc(50%+2px)] bg-[rgba(255,255,255,0.1)] shadow-[0_1px_8px_rgba(255,255,255,0.04)]"
                : "left-1 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
            }`}
          />
          <button
            onClick={() => { if (isDark) toggleTheme(); }}
            aria-label="Light mode"
            className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 border-none rounded-[10px] cursor-pointer text-[13px] font-medium transition-all duration-300 bg-transparent ${
              !isDark
                ? "text-[#37352f]"
                : "text-[#5a5a5a] hover:text-[#9b9b9b]"
            }`}
          >
            <span className="text-[15px] leading-none">☀️</span> Light
          </button>
          <button
            onClick={() => { if (!isDark) toggleTheme(); }}
            aria-label="Dark mode"
            className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 border-none rounded-[10px] cursor-pointer text-[13px] font-medium transition-all duration-300 bg-transparent ${
              isDark
                ? "text-[#ebebeb]"
                : "text-[#b4b4b0] hover:text-[#787774]"
            }`}
          >
            <span className="text-[15px] leading-none">🌙</span> Dark
          </button>
        </div>
      </nav>
    </>
  );
}
