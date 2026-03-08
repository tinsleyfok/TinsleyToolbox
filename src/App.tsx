import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { NavDrawer } from "./components/NavDrawer";
import { useTheme } from "./hooks/useTheme";

const PAGE_TITLES: Record<string, string> = {
  "/": "Folders",
  "/animation": "Animation",
  "/inspiration": "Inspiration",
};

export function App() {
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const title = PAGE_TITLES[pathname];
  const isDark = theme === "dark";
  const isAppRoute = pathname.startsWith("/app");

  useEffect(() => {
    const bg = isAppRoute
      ? (isDark ? "#000000" : "#f2f2f2")
      : (isDark ? "#191919" : "#f7f7f5");
    document.documentElement.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
  }, [isDark, isAppRoute]);

  return (
    <div className={`min-h-screen transition-colors ${isAppRoute ? "" : isDark ? "bg-[#191919]" : "bg-[#f7f7f5]"}`}>
      <NavDrawer />
      {!isAppRoute && title && (
        <header className={`sticky top-0 z-100 flex items-center h-13 pl-16 pr-4 transition-colors ${isDark ? "bg-[#191919]" : "bg-[#f7f7f5]"}`}>
          <h1 className={`text-[17px] font-semibold m-0 ${isDark ? "text-[#ebebeb]" : "text-[#37352f]"}`}>
            {title}
          </h1>
        </header>
      )}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
