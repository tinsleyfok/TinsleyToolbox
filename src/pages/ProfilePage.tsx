import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTheme } from "../hooks/useTheme";
import { ProfileHeader } from "../components/ProfileHeader";
import { FeedCard, type FeedCardData } from "../components/FeedCard";
import { holoAvatar } from "../utils/holoAvatar";
import { publicUrl, tinsleyProfilePhoto } from "../utils/publicAsset";

const TABS = ["My Card", "Collections", "Likes"] as const;

const feedImg = (file: string) => publicUrl(`images/${file}`);

const myAvatar = tinsleyProfilePhoto;

/** Local `public/images` assets — reliable offline and on GitHub Pages. */
const MY_CARD_MEDIA = {
  drafts: feedImg("feed-decor2.jpg"),
  petShop: feedImg("feed-chihuahua.png"),
  sushi: feedImg("feed-food.jpg"),
  lego: feedImg("feed-beads.png"),
  newMexico: feedImg("feed-decor1.jpg"),
};

const MY_CARDS_LEFT: FeedCardData[] = [
  {
    id: "mc1",
    variant: "draft",
    size: "landscape",
    title: "Drafts",
    username: "",
    likes: "",
    imageUrl: MY_CARD_MEDIA.drafts,
  },
  {
    id: "mc3",
    variant: "image",
    size: "landscape",
    title: "Sushi iShikawa @NYC",
    username: "tinsleyfok",
    likes: "3.9K",
    imageUrl: MY_CARD_MEDIA.sushi,
    avatarUrl: myAvatar,
    views: "10,480",
  },
  {
    id: "mc5",
    variant: "video",
    size: "landscape",
    title: "The lego I built these years",
    username: "tinsleyfok",
    likes: "12",
    imageUrl: MY_CARD_MEDIA.lego,
    avatarUrl: myAvatar,
    views: "489",
  },
];

const MY_CARDS_RIGHT: FeedCardData[] = [
  {
    id: "mc2",
    variant: "video",
    size: "portrait",
    title: "Fake smile buddy",
    username: "tinsleyfok",
    likes: "1.6K",
    imageUrl: MY_CARD_MEDIA.petShop,
    avatarUrl: myAvatar,
    views: "100,480",
  },
  {
    id: "mc4",
    variant: "image",
    size: "landscape",
    title: "New Mexico - Marfa",
    username: "tinsleyfok",
    likes: "2",
    imageUrl: MY_CARD_MEDIA.newMexico,
    avatarUrl: myAvatar,
    views: "89",
  },
];

const COLLECTIONS_LEFT: FeedCardData[] = [
  {
    id: "cl1",
    variant: "image",
    size: "portrait",
    title: "Interior inspo",
    username: "tinsleyfok",
    likes: "",
    imageUrl: feedImg("feed-interior.jpg"),
    avatarUrl: myAvatar,
    views: "24 cards",
  },
  {
    id: "cl3",
    variant: "image",
    size: "landscape",
    title: "Travel bucket list",
    username: "tinsleyfok",
    likes: "",
    imageUrl: feedImg("living-room.png"),
    avatarUrl: myAvatar,
    views: "18 cards",
  },
];

const COLLECTIONS_RIGHT: FeedCardData[] = [
  {
    id: "cl2",
    variant: "image",
    size: "landscape",
    title: "Food spots GZ",
    username: "tinsleyfok",
    likes: "",
    imageUrl: feedImg("feed-food.jpg"),
    avatarUrl: myAvatar,
    views: "31 cards",
  },
  {
    id: "cl4",
    variant: "image",
    size: "portrait",
    title: "Design references",
    username: "tinsleyfok",
    likes: "",
    imageUrl: feedImg("feed-decor2.jpg"),
    avatarUrl: myAvatar,
    views: "12 cards",
  },
];

const LIKES_LEFT: FeedCardData[] = [
  {
    id: "lk1",
    variant: "video",
    size: "portrait",
    title: "How to make the perfect matcha",
    username: "matchalover",
    likes: "24.5K",
    imageUrl: feedImg("feed-food.jpg"),
    avatarUrl: holoAvatar("matcha"),
  },
  {
    id: "lk3",
    variant: "article",
    title: "Why every designer should learn to code in 2025",
    username: "designdev",
    likes: "8.2K",
    avatarUrl: holoAvatar("designdev"),
    body: "The gap between design and development is shrinking. Here's why picking up React or SwiftUI will make you 10x more valuable...",
  },
];

const LIKES_RIGHT: FeedCardData[] = [
  {
    id: "lk2",
    variant: "discussion",
    size: "square",
    title: "What's one design trend you think will die in 2025?",
    username: "ux.thoughts",
    likes: "3.4K",
    avatarUrl: holoAvatar("uxthoughts"),
  },
  {
    id: "lk4",
    variant: "video",
    size: "portrait",
    title: "Street photography tips",
    username: "shuttercraft",
    likes: "11.3K",
    imageUrl: feedImg("feed-cat.jpg"),
    avatarUrl: holoAvatar("shutter"),
  },
];

const TAB_DATA: Record<string, { left: FeedCardData[]; right: FeedCardData[] }> = {
  "My Card": { left: MY_CARDS_LEFT, right: MY_CARDS_RIGHT },
  Collections: { left: COLLECTIONS_LEFT, right: COLLECTIONS_RIGHT },
  Likes: { left: LIKES_LEFT, right: LIKES_RIGHT },
};

/** Illustrated avatar for MVP profile only (not the V1 photo). */
const MVP_PROFILE_AVATAR = holoAvatar("gist-mvp", 256);

export function ProfilePage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isMvpProfile = pathname.startsWith("/app/mvp/profile");
  const [activeTab, setActiveTab] = useState<string>("My Card");
  const textColor = isDark ? "#ffffff" : "#000000";
  const { left, right } = TAB_DATA[activeTab] || TAB_DATA["My Card"];

  const headerBg = isDark ? "#000000" : isMvpProfile ? "#FAFAFA" : "#f2f2f2";

  return (
    <div>
      <div
        className={`sticky top-0 z-40 flex items-center justify-between px-4 ${isMvpProfile ? "min-h-12" : "h-12"}`}
        style={{
          background: headerBg,
          ...(isMvpProfile ? { paddingTop: "max(4px, env(safe-area-inset-top, 0px))" } : {}),
        }}
      >
        {isMvpProfile ? (
          <>
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent"
              style={{ color: textColor }}
              aria-label="Back"
              onClick={() => navigate(-1)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15.5303 4.46967C15.8232 4.76256 15.8232 5.23744 15.5303 5.53033L9.81066 11.25H20.25C20.6642 11.25 21 11.5858 21 12C21 12.4142 20.6642 12.75 20.25 12.75H9.81066L15.5303 18.4697C15.8232 18.7626 15.8232 19.2374 15.5303 19.5303C15.2374 19.8232 14.7626 19.8232 14.4697 19.5303L7.21967 12.2803C6.92678 11.9874 6.92678 11.5126 7.21967 11.2197L14.4697 3.96967C14.7626 3.67678 15.2374 3.67678 15.5303 3.96967Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <h1 className="font-rethink m-0 text-[18px] font-bold" style={{ color: textColor }}>
              tinsleyfok
            </h1>
            <div className="h-10 w-10 shrink-0" aria-hidden />
          </>
        ) : (
          <>
            <div className="w-10" />
            <h1 className="font-rethink m-0 text-[18px] font-bold" style={{ color: textColor }}>
              tinsleyfok
            </h1>
            <button
              type="button"
              className="flex h-10 w-10 cursor-pointer items-center justify-center border-none bg-transparent"
              style={{ color: textColor }}
              aria-label="Settings"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.6052 3.66646C16.9458 3.46607 17.3748 3.49641 17.6838 3.74276L18.7176 4.56684C19.0264 4.81297 19.1516 5.22385 19.0327 5.60038L18.5335 7.18075C19.1346 8.00311 19.5932 8.94875 19.8647 9.98964L21.4155 10.5838C21.7846 10.7252 22.0283 11.0795 22.0284 11.4747L22.0286 12.7967C22.0287 13.1916 21.7855 13.5457 21.417 13.6875L19.8442 14.2925C19.5703 15.2941 19.112 16.233 18.4996 17.0612L19.0063 18.658C19.1258 19.0347 19.0008 19.4461 18.6918 19.6925L17.6583 20.517C17.3497 20.7632 16.9212 20.7939 16.5806 20.5941L15.1319 19.7446C14.6633 19.9485 14.1691 20.1119 13.6526 20.2298C13.1371 20.3475 12.6218 20.4147 12.112 20.4346L11.1918 21.8079C10.9718 22.1362 10.5722 22.295 10.1869 22.2071L8.89794 21.9131C8.51297 21.8252 8.22185 21.5094 8.16566 21.1185L7.93145 19.4895C6.99679 19.0001 6.15708 18.3356 5.464 17.5286L3.85692 17.662C3.46306 17.6947 3.0898 17.4813 2.91829 17.1252L2.34456 15.9341C2.1732 15.5784 2.23865 15.1539 2.50919 14.8663L3.61097 13.695C3.39816 12.6065 3.40841 11.5231 3.611 10.4935L2.52514 9.34188C2.25402 9.05433 2.18822 8.6294 2.35968 8.27332L2.93324 7.08216C3.10454 6.7264 3.47728 6.51289 3.87082 6.54511L5.4614 6.67532C6.1526 5.86678 7.0016 5.18569 7.9753 4.68477L8.19925 3.11384C8.25502 2.72258 8.54622 2.4062 8.93153 2.31823L10.2204 2.02399C10.6054 1.9361 11.0047 2.0944 11.2249 2.42217L12.1266 3.76452C13.2053 3.80658 14.2491 4.05867 15.2071 4.48888L16.6052 3.66646ZM17.4876 10.7999C18.2051 13.9431 16.2388 17.0729 13.0956 17.7904C9.95247 18.508 6.82272 16.5417 6.10515 13.3985C5.38758 10.2553 7.35391 7.12558 10.4971 6.408C13.6402 5.69043 16.77 7.65676 17.4876 10.7999Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      <ProfileHeader avatarSrc={isMvpProfile ? MVP_PROFILE_AVATAR : undefined} />

      <div
        className="rounded-t-[36px] relative"
        style={{ background: isDark ? "#0f0f0f" : "#f6f6f6" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-32 rounded-t-[36px] pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, ${isDark ? "#1a1a1a" : "#ececec"}, ${isDark ? "#0f0f0f" : "#f6f6f6"})`,
          }}
        />
        <div className="px-1 pt-1 relative z-10">
          <div className="rounded-full flex items-center h-[50px] px-5">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 h-full flex items-center justify-center bg-transparent border-none cursor-pointer font-rethink text-[14px] font-medium"
                  style={{ color: textColor, opacity: isActive ? 1 : 0.48 }}
                >
                  {tab}
                  {tab === "My Card" && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-1">
                      <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3 px-2 pt-3 pb-[36px]">
          <div className="flex flex-col gap-3 min-w-0">
            {left.map((card) => (
              <FeedCard key={card.id} card={card} />
            ))}
          </div>
          <div className="flex flex-col gap-3 min-w-0">
            {right.map((card) => (
              <FeedCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
