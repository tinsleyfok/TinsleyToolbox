import { useState } from "react";
import { Outlet } from "react-router";
import { useTheme } from "../hooks/useTheme";
import { BottomMenuBar } from "../components/BottomMenuBar";
import { CreateSheet } from "../components/CreateSheet";

export function AppPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: isDark ? "#0f0f0f" : "#ffffff" }}
    >
      <div className="flex-1 pb-14 overflow-y-auto">
        <Outlet />
      </div>
      <BottomMenuBar onCreatePress={() => setCreateOpen(!createOpen)} createOpen={createOpen} />
      <CreateSheet open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
