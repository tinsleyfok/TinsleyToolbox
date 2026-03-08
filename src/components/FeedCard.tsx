import { useTheme } from "../hooks/useTheme";

type CardVariant = "video" | "image" | "article" | "discussion" | "draft";
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

export function FeedCard({ card, bordered }: { card: FeedCardData; bordered?: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const size = card.size || "portrait";
  const imageHeight = size === "portrait" ? 252 : size === "square" ? 187 : 140;

  const cardBg = bordered
    ? (isDark ? "#181818" : "#fafafa")
    : (isDark ? "#1c1c1e" : "#f5f5f5");

  const borderStyle = bordered
    ? `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`
    : "none";

  if (card.variant === "draft") {
    return (
      <div
        className="rounded-2xl overflow-hidden w-full relative"
        style={{ height: imageHeight, border: borderStyle }}
      >
        {card.imageUrl && (
          <img src={card.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.36)" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-10">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M23.25 20.25C23.6642 20.25 24 20.5858 24 21V22.5C24 22.9142 23.6642 23.25 23.25 23.25H12.75C12.3358 23.25 12 22.9142 12 22.5V21C12 20.5858 12.3358 20.25 12.75 20.25H23.25Z" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M29.313 6.00513C30.2879 6.02046 30.8811 6.08145 31.3623 6.32666C31.9267 6.61426 32.3857 7.07332 32.6733 7.6377C33.0003 8.27943 33 9.12014 33 10.8003V11.6997L32.9949 12.813C32.9795 13.7879 32.9185 14.3811 32.6733 14.8623L32.5576 15.0688C32.2967 15.4942 31.9328 15.8472 31.5 16.0972L31.4993 23.688C31.4926 25.6306 31.4384 26.7005 31.0093 27.5427L30.9258 27.7002C30.4916 28.475 29.8365 29.1048 29.0427 29.5093L28.8589 29.5957C28.0435 29.946 26.992 29.993 25.188 29.9993H10.812C9.00798 29.993 7.95651 29.946 7.14111 29.5957L6.95728 29.5093C6.16354 29.1048 5.50844 28.475 5.07422 27.7002L4.99072 27.5427C4.56161 26.7005 4.50744 25.6306 4.50073 23.688L4.5 16.0972C4.06719 15.8472 3.70326 15.4942 3.44238 15.0688L3.32666 14.8623C3.08145 14.3811 3.02046 13.7879 3.00513 12.813L3 11.6997V10.8003C3 9.22505 3.00006 8.38798 3.26953 7.76074L3.32666 7.6377C3.57832 7.14384 3.96127 6.7306 4.43115 6.44238L4.6377 6.32666C5.11894 6.08145 5.71205 6.02046 6.68701 6.00513L7.80029 6H28.1997L29.313 6.00513ZM7.5 22.8003C7.5 24.1095 7.50229 24.9112 7.55127 25.511C7.5741 25.7904 7.60253 25.9598 7.62671 26.0625C7.63821 26.1113 7.64801 26.1415 7.65381 26.1577C7.65937 26.1733 7.66333 26.1812 7.66333 26.1812L7.72119 26.2844C7.8653 26.5194 8.07192 26.7108 8.31885 26.8367L8.34229 26.8462C8.35853 26.852 8.38866 26.8618 8.4375 26.8733C8.54019 26.8975 8.70963 26.9259 8.98901 26.9487C9.58882 26.9977 10.3905 27 11.6997 27H24.3003C25.6095 27 26.4112 26.9977 27.011 26.9487C27.2904 26.9259 27.4598 26.8975 27.5625 26.8733C27.6113 26.8618 27.6415 26.852 27.6577 26.8462C27.6733 26.8406 27.6812 26.8367 27.6812 26.8367L27.7844 26.7788C28.0194 26.6347 28.2108 26.4281 28.3367 26.1812L28.3462 26.1577C28.352 26.1415 28.3618 26.1113 28.3733 26.0625C28.3975 25.9598 28.4259 25.7904 28.4487 25.511C28.4977 24.9112 28.5 24.1095 28.5 22.8003V16.5H7.5V22.8003ZM7.80029 9C6.91078 9 6.42372 9.00219 6.07397 9.03076C6.06032 9.03188 6.04739 9.03403 6.03516 9.03516C6.03403 9.04739 6.03188 9.06032 6.03076 9.07397C6.00219 9.42372 6 9.91078 6 10.8003V11.6997C6 12.5892 6.00219 13.0763 6.03076 13.426C6.03186 13.4394 6.03405 13.4521 6.03516 13.4641C6.04741 13.4652 6.06029 13.4681 6.07397 13.4692C6.42372 13.4978 6.91078 13.5 7.80029 13.5H28.1997C29.0892 13.5 29.5763 13.4978 29.926 13.4692C29.9394 13.4681 29.9521 13.4652 29.9641 13.4641C29.9652 13.4521 29.9681 13.4394 29.9692 13.426C29.9978 13.0763 30 12.5892 30 11.6997V10.8003C30 9.91078 29.9978 9.42372 29.9692 9.07397C29.9681 9.06029 29.9652 9.04741 29.9641 9.03516C29.9521 9.03405 29.9394 9.03186 29.926 9.03076C29.5763 9.00219 29.0892 9 28.1997 9H7.80029Z" fill="white"/>
          </svg>
          <span className="font-rethink text-[18px] font-bold text-white">Drafts</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden w-full"
      style={{ background: cardBg, border: borderStyle }}
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
        <div className="absolute top-2 right-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0Z" fill="black" fillOpacity="0.36"/>
            <path d="M13.8426 10.3344C13.9376 10.1216 13.9376 9.87831 13.8426 9.66544C13.7754 9.51501 13.6528 9.40808 13.5238 9.31748C13.3959 9.22768 13.2242 9.12917 13.0171 9.01041L9.06499 6.74334C8.85975 6.6256 8.68937 6.52786 8.54829 6.46328C8.40583 6.39806 8.25261 6.34656 8.08966 6.36401C7.85882 6.38873 7.64926 6.51011 7.51295 6.69805C7.41673 6.83071 7.38517 6.98924 7.37085 7.14527C7.35668 7.29978 7.35668 7.49619 7.35669 7.73281L7.35669 12.267C7.35668 12.5037 7.35668 12.7001 7.37085 12.8546C7.38517 13.0106 7.41673 13.1691 7.51295 13.3018C7.64926 13.4898 7.85882 13.6111 8.08966 13.6359C8.25261 13.6533 8.40582 13.6018 8.54829 13.5366C8.68937 13.472 8.85975 13.3743 9.06501 13.2565L13.0171 10.9895C13.2242 10.8707 13.3959 10.7722 13.5238 10.6824C13.6528 10.5918 13.7754 10.4849 13.8426 10.3344Z" fill="white"/>
          </svg>
        </div>
      )}
      {card.views && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 rounded-full px-2 py-0.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M7.20732 6.125C7.20732 6.80457 6.66678 7.35547 6 7.35547C5.33322 7.35547 4.79268 6.80457 4.79268 6.125C4.79268 5.44543 5.33322 4.89453 6 4.89453C6.66678 4.89453 7.20732 5.44543 7.20732 6.125Z" fill="white"/>
            <path d="M6 10.5C9.5 10.5 11.25 7.41177 11.5 6.125C11.25 4.83824 9.5 1.75 6 1.75C2.5 1.75 0.75 4.83824 0.5 6.125C0.75 7.41177 2.5 10.5 6 10.5ZM8.28049 6.125C8.28049 7.40863 7.25948 8.44922 6 8.44922C4.74052 8.44922 3.71951 7.40863 3.71951 6.125C3.71951 4.84137 4.74052 3.80078 6 3.80078C7.25948 3.80078 8.28049 4.84137 8.28049 6.125Z" fill="white"/>
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
    <div className="px-3 pb-2.5" style={{ paddingTop: hasImageTitle ? 10 : 4 }}>
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
