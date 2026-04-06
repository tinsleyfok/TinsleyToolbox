import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { NavDrawer } from "./components/NavDrawer";
import { useTheme } from "./hooks/useTheme";

export function App() {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isAppRoute = pathname.startsWith("/app");

  useEffect(() => {
    const bg = isAppRoute ? (isDark ? "#000000" : "#f2f2f2") : isDark ? "#191919" : "#f7f7f5";
    document.documentElement.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
  }, [isDark, isAppRoute]);

  return (
    <div
      className={`flex min-h-0 min-h-dvh min-h-screen flex-1 flex-col ${isAppRoute ? "" : isDark ? "bg-[#191919]" : "bg-[#f7f7f5]"}`}
    >
      <NavDrawer />
      <main className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
