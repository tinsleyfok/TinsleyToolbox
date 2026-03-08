import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { ProfileHeader } from "../components/ProfileHeader";
import { FeedCard, type FeedCardData } from "../components/FeedCard";

const TABS = ["My Card", "Collections", "Likes"] as const;

const PROFILE_CARDS: FeedCardData[] = [
  {
    id: "p1",
    variant: "image",
    size: "portrait",
    title: "",
    username: "",
    likes: "",
    imageBg: "#6a3a9a",
    views: "Drafts",
  },
  {
    id: "p2",
    variant: "video",
    size: "landscape",
    title: "Fake smile buddy",
    username: "tinsleyfok",
    likes: "1.6K",
    imageBg: "#9a3a5a",
    views: "100,480",
  },
  {
    id: "p3",
    variant: "image",
    size: "landscape",
    title: "Sushi iShikawa @NYC",
    username: "",
    likes: "",
    imageBg: "#3a5a2a",
    views: "10,480",
  },
  {
    id: "p4",
    variant: "image",
    size: "landscape",
    title: "",
    username: "",
    likes: "",
    imageBg: "#5a8ac0",
  },
];

export function ProfilePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<string>("My Card");

  return (
    <div>
      {/* Top nav */}
      <div className="flex items-center justify-between h-12 px-4">
        <div className="w-10" />
        <h1
          className="font-rethink text-[20px] font-bold m-0"
          style={{ color: isDark ? "#ffffff" : "#000000" }}
        >
          tinsleyfok
        </h1>
        <button className="w-10 h-10 flex items-center justify-center bg-transparent border-none cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke={isDark ? "#fff" : "#000"} strokeWidth="1.8" />
            <path d="M12 8V12L15 14" stroke={isDark ? "#fff" : "#000"} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <ProfileHeader />

      {/* Tabs */}
      <div
        className="flex items-center h-[50px] border-b"
        style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 h-full flex items-center justify-center bg-transparent border-none cursor-pointer font-rethink text-[14px] font-medium"
            style={{
              color: activeTab === tab
                ? (isDark ? "#ffffff" : "#000000")
                : (isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"),
              borderBottom: activeTab === tab ? `2px solid ${isDark ? "#fff" : "#000"}` : "2px solid transparent",
            }}
          >
            {tab}
            {tab === "My Card" && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1">
                <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Card grid */}
      <div className="flex gap-3 px-2 py-3">
        <div className="flex-1 flex flex-col gap-3">
          {PROFILE_CARDS.filter((_, i) => i % 2 === 0).map((card) => (
            <FeedCard key={card.id} card={card} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-3">
          {PROFILE_CARDS.filter((_, i) => i % 2 === 1).map((card) => (
            <FeedCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
