import { useTheme } from "../hooks/useTheme";

export interface PostCardData {
  id: string;
  username: string;
  title: string;
  timestamp: string;
  imageBg: string;
  /** 1:1 or 3:4 aspect */
  aspect?: "square" | "portrait";
  likes: string;
  comments: string;
  saves: string;
  /** Carousel page indicator e.g. "2/3" */
  carousel?: string;
}

export function PostCard({ data }: { data: PostCardData }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const textColor = isDark ? "#ffffff" : "#000000";
  const subtleColor = isDark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.48)";

  const aspectRatio = data.aspect === "portrait" ? "3/4" : "1/1";

  return (
    <div
      className="rounded-[36px] overflow-hidden mx-2 mb-4"
      style={{ background: isDark ? "#181818" : "#ffffff" }}
    >
      {/* Image area */}
      <div
        className="relative w-full"
        style={{ aspectRatio, background: data.imageBg }}
      >
        {data.carousel && (
          <div className="absolute top-3 right-3 bg-black/40 rounded-full px-2.5 py-1">
            <span className="text-white text-[12px] font-rethink">{data.carousel}</span>
          </div>
        )}
      </div>

      {/* Text section */}
      <div className="p-4 pt-3">
        {/* User row */}
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="w-8 h-8 rounded-full flex-shrink-0"
            style={{ background: isDark ? "#333" : "#ddd" }}
          />
          <span className="font-rethink text-[16px] font-medium" style={{ color: textColor }}>
            {data.username}
          </span>
          <button
            className="w-5 h-5 rounded-full flex items-center justify-center border-none cursor-pointer ml-1"
            style={{ background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 2V8M2 5H8" stroke={textColor} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {data.title && (
          <p className="font-rethink text-[15px] m-0 mb-1 leading-snug" style={{ color: textColor }}>
            {data.title}
          </p>
        )}

        <p className="font-rethink text-[14px] m-0 mb-3" style={{ color: subtleColor }}>
          {data.timestamp}
        </p>

        {/* Action bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like */}
            <ActionButton isDark={isDark}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 5.5C9.5 2.5 5 2.5 3.5 5.5C1.5 9 3 13 12 21C21 13 22.5 9 20.5 5.5C19 2.5 14.5 2.5 12 5.5Z" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </ActionButton>
            {/* Comment */}
            <ActionButton isDark={isDark}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="1.8" fill="none" />
              </svg>
            </ActionButton>
            {/* Bookmark */}
            <ActionButton isDark={isDark}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 3H19V21L12 17L5 21V3Z" stroke="currentColor" strokeWidth="1.8" fill="none" />
              </svg>
            </ActionButton>
          </div>
          <div className="flex items-center gap-4">
            {/* Share */}
            <ActionButton isDark={isDark}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L20 11H15V21H9V11H4L12 3Z" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
              </svg>
            </ActionButton>
            {/* More */}
            <ActionButton isDark={isDark}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="6" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="18" r="1.5" fill="currentColor" />
              </svg>
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ isDark, children }: { isDark: boolean; children: React.ReactNode }) {
  return (
    <button
      className="bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
      style={{ color: isDark ? "#ffffff" : "#000000" }}
    >
      {children}
    </button>
  );
}
