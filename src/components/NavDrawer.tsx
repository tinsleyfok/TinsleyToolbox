import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useTheme } from "../hooks/useTheme";

interface NavItem {
  to: string;
  label: string;
  isFolder?: boolean;
  children?: { to: string; label: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home" },
  {
    to: "/app",
    label: "Theme",
    isFolder: true,
    children: [{ to: "/app", label: "Modern & Neutral" }],
  },
  {
    to: "/animation",
    label: "Animation",
    isFolder: true,
    children: [
      { to: "/animation/onboarding", label: "Onboarding" },
      { to: "/animation/flip-card", label: "Flip card" },
      { to: "/animation/like", label: "Like" },
      { to: "/animation/opening", label: "Opening" },
    ],
  },
  {
    to: "/inspiration",
    label: "Inspiration",
    isFolder: true,
    children: [{ to: "/inspiration/animations", label: "Animations" }],
  },
];

export function NavDrawer() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    NAV_ITEMS.forEach(item => {
      if (item.children) init[item.to] = true;
    });
    return init;
  });

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
        <div className="flex-1 flex flex-col gap-0.5 min-h-0 overflow-y-auto overflow-x-hidden pr-0.5 -mr-0.5">
        {NAV_ITEMS.map((item, i) => {
          const isActive = pathname === item.to || item.children?.some(c => pathname === c.to);
          const textColor = isDark ? "#ebebeb" : "#37352f";
          const hoverBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(55,53,47,0.06)";
          return (
            <div key={item.to}>
              {i === 1 && (
                <div className={`h-px my-3 mx-2 ${isDark ? "bg-[rgba(255,255,255,0.08)]" : "bg-[rgba(55,53,47,0.08)]"}`} />
              )}
              {item.children ? (
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [item.to]: !prev[item.to] }))}
                  className="flex items-center justify-between w-full px-3 py-3 rounded-lg border-none cursor-pointer text-[15px] transition-colors text-left bg-transparent"
                  style={{
                    color: textColor,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className="transition-transform duration-200 flex-shrink-0"
                    style={{ transform: expanded[item.to] ? "rotate(90deg)" : "rotate(0deg)", opacity: 0.4 }}
                  >
                    <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-3 py-3 rounded-lg no-underline text-[15px] transition-colors"
                  style={{
                    color: textColor,
                    fontWeight: item.isFolder ? 600 : 400,
                    background: isActive ? hoverBg : "transparent",
                  }}
                >
                  {item.label}
                </Link>
              )}
              {item.children && expanded[item.to] && (
                <div className="flex flex-col gap-0.5 mt-0.5">
                  {item.children.map((child) => {
                    const childActive = pathname === child.to;
                    return (
                      <Link
                        key={child.to}
                        to={child.to}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 py-2.5 pl-3 pr-3 rounded-lg no-underline text-[14px] transition-colors"
                        style={{
                          color: textColor,
                          opacity: childActive ? 1 : 0.65,
                          background: childActive ? hoverBg : "transparent",
                        }}
                      >
                        <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: isDark ? "rgba(255,255,255,0.25)" : "rgba(55,53,47,0.25)" }} />
                        {child.label}
                      </Link>
                    );
                  })}
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
