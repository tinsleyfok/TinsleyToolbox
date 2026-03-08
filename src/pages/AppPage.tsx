import { useState } from "react";
import { Outlet } from "react-router";
import { useTheme } from "../hooks/useTheme";
import { BottomMenuBar } from "../components/BottomMenuBar";
import { CreateSheet } from "../components/CreateSheet";

export function AppPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [createOpen, setCreateOpen] = useState(false);

  const appBg = isDark ? "#000000" : "#f2f2f2";

  return (
    <div className="app-shell">
      <div className="app-phone-wrapper">
        <img
          src={`${import.meta.env.BASE_URL}Image/Phone.png`}
          alt="Phone"
          className="app-phone-img"
        />
        <div className="app-phone-screen" style={{ background: appBg }}>
          <div className="app-screen-inner">
            <div className="app-content">
              <Outlet />
            </div>
            <BottomMenuBar onCreatePress={() => setCreateOpen(!createOpen)} createOpen={createOpen} />
            <CreateSheet open={createOpen} onClose={() => setCreateOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}
