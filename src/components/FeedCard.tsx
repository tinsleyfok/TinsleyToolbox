import { useTheme } from "../hooks/useTheme";

type CardVariant = "video" | "image" | "article" | "discussion";
type CardSize = "portrait" | "landscape" | "square";

export interface FeedCardData {
  id: string;
  variant: CardVariant;
  /** portrait (4:3 tall), landscape (3:4 wide), square (1:1) */
  size?: CardSize;
  title: string;
  username: string;
  likes: string;
  imageBg?: string;
  imageUrl?: string;
  avatarUrl?: string;
  body?: string;
  views?: string;
}

export function FeedCard({ card }: { card: FeedCardData }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const size = card.size || "portrait";
  const imageHeight = size === "portrait" ? 252 : size === "square" ? 187 : 140;

  return (
    <div
      className="rounded-2xl overflow-hidden w-full"
      style={{ background: isDark ? "#1c1c1e" : "#f5f5f5" }}
    >
      {card.variant === "article" ? (
        <ArticleContent card={card} isDark={isDark} />
      ) : card.variant === "discussion" ? (
        <DiscussionContent card={card} isDark={isDark} size={size} />
      ) : (
        <ImageContent card={card} isDark={isDark} height={imageHeight} />
      )}
      <CardFooter card={card} isDark={isDark} />
    </div>
  );
}

function ImageContent({ card, isDark: _isDark, height }: { card: FeedCardData; isDark: boolean; height: number }) {
  return (
    <div className="relative" style={{ height, background: card.imageBg || "#2a2a2a" }}>
      {card.imageUrl && (
        <img src={card.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      )}
      {card.variant === "video" && (
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/36 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2.5 1.5L8.5 5L2.5 8.5V1.5Z" fill="white" />
          </svg>
        </div>
      )}
      {card.views && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 rounded-full px-2 py-0.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.2" />
            <path d="M4 6L6 6L6 3.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white text-[11px] font-rethink">{card.views}</span>
        </div>
      )}
    </div>
  );
}

function ArticleContent({ card, isDark }: { card: FeedCardData; isDark: boolean }) {
  return (
    <div
      className="p-4 flex flex-col gap-2"
      style={{
        background: isDark ? "#2c2c2a" : "#f0ebe7",
        minHeight: 187,
      }}
    >
      <h3
        className="font-rethink text-[16px] font-bold leading-tight m-0"
        style={{ color: isDark ? "#ffffff" : "#000000" }}
      >
        {card.title}
      </h3>
      {card.body && (
        <p
          className="font-charter text-[12px] leading-snug m-0 line-clamp-5"
          style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}
        >
          {card.body}
        </p>
      )}
    </div>
  );
}

function DiscussionContent({ card, isDark, size }: { card: FeedCardData; isDark: boolean; size: CardSize }) {
  const h = size === "portrait" ? 252 : size === "square" ? 187 : 140;
  return (
    <div
      className="relative flex items-center justify-center p-5"
      style={{
        background: isDark ? "#2c2c2a" : "#f0ebe7",
        height: h,
      }}
    >
      {/* Opening quotation marks */}
      <svg className="absolute top-3 left-3" width="32" height="24" viewBox="0 0 32 24" fill="none">
        <path d="M0 14.4C0 6.4 5.6 0 13.6 0V4.8C9.6 4.8 6.4 8 6.4 12H12.8V24H0V14.4Z" fill={isDark ? "#b8960a" : "#d19900"} />
        <path d="M16.8 14.4C16.8 6.4 22.4 0 30.4 0V4.8C26.4 4.8 23.2 8 23.2 12H29.6V24H16.8V14.4Z" fill={isDark ? "#b8960a" : "#d19900"} />
      </svg>
      {/* Title */}
      <p
        className="font-rethink text-[15px] font-bold leading-snug m-0 text-center z-10 px-2"
        style={{ color: isDark ? "#ffffff" : "#000000" }}
      >
        {card.title}
      </p>
      {/* Closing quotation marks */}
      <svg className="absolute bottom-3 right-3" width="32" height="24" viewBox="0 0 32 24" fill="none">
        <path d="M32 9.6C32 17.6 26.4 24 18.4 24V19.2C22.4 19.2 25.6 16 25.6 12H19.2V0H32V9.6Z" fill={isDark ? "#b8960a" : "#d19900"} />
        <path d="M15.2 9.6C15.2 17.6 9.6 24 1.6 24V19.2C5.6 19.2 8.8 16 8.8 12H2.4V0H15.2V9.6Z" fill={isDark ? "#b8960a" : "#d19900"} />
      </svg>
    </div>
  );
}

function CardFooter({ card, isDark }: { card: FeedCardData; isDark: boolean }) {
  const hasImageTitle = card.variant === "video" || card.variant === "image";

  return (
    <div className="px-2 pb-2" style={{ paddingTop: hasImageTitle ? 8 : 4 }}>
      {hasImageTitle && (
        <p
          className="font-rethink text-[13px] leading-tight m-0 mb-1 line-clamp-2"
          style={{ color: isDark ? "#ffffff" : "#000000" }}
        >
          {card.title}
        </p>
      )}
      <div className="flex items-center gap-1">
        {card.avatarUrl ? (
          <img src={card.avatarUrl} alt="" className="w-3.5 h-3.5 rounded-full flex-shrink-0 object-cover" />
        ) : (
          <div
            className="w-3.5 h-3.5 rounded-full flex-shrink-0"
            style={{ background: isDark ? "#333" : "#ddd" }}
          />
        )}
        <span
          className="font-rethink text-[12px] flex-1 truncate"
          style={{ color: isDark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.48)" }}
        >
          {card.username}
        </span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
          <path d="M3.7313 2.53376C3.35194 2.61064 2.66144 2.96879 2.20403 3.64332C1.77215 4.28018 1.52057 5.24014 2.04493 6.61201C2.45555 7.68634 3.38434 8.77817 4.43694 9.71689C5.35264 10.5335 6.31577 11.1936 7.0001 11.5848C7.68442 11.1936 8.64755 10.5335 9.56326 9.71689C10.6158 8.77817 11.5446 7.68634 11.9553 6.61201C12.4796 5.24014 12.228 4.28018 11.7962 3.64332C11.3387 2.96879 10.6483 2.61064 10.2689 2.53376C8.67301 2.21036 7.77975 3.23536 7.0001 4.33738C6.22037 3.23525 5.31649 2.21252 3.7313 2.53376ZM7.0001 2.75333C7.93557 1.57978 9.21979 1.13078 10.5006 1.39033C11.1744 1.52688 12.1304 2.05747 12.7618 2.98852C13.4187 3.95723 13.6982 5.31968 13.045 7.02854C12.5354 8.36186 11.4428 9.60388 10.3398 10.5876C9.22812 11.579 8.04387 12.3625 7.27042 12.7669L7.0001 12.9083L6.72978 12.7669C5.95632 12.3625 4.77207 11.579 3.66042 10.5876C2.55737 9.60388 1.46477 8.36186 0.955151 7.02854C0.301992 5.31968 0.581531 3.95723 1.23844 2.98852C1.86981 2.05747 2.82578 1.52688 3.49959 1.39033C4.78041 1.13078 6.06463 1.57978 7.0001 2.75333Z" fill={isDark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.48)"} />
        </svg>
        <span
          className="font-rethink text-[12px] flex-shrink-0"
          style={{ color: isDark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.48)" }}
        >
          {card.likes}
        </span>
      </div>
    </div>
  );
}
