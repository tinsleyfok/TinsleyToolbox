import { useTheme } from "../hooks/useTheme";

export interface MessageData {
  id: string;
  username: string;
  message: string;
  time: string;
  avatarBg?: string;
  avatarUrl?: string;
}

export function MessageItem({ data }: { data: MessageData }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button className="w-full flex items-center bg-transparent border-none cursor-pointer text-left px-4 py-3">
      <div className="flex items-center gap-3 w-full">
        {data.avatarUrl ? (
          <img src={data.avatarUrl} alt="" className="w-14 h-14 rounded-full flex-shrink-0 object-cover" />
        ) : (
          <div
            className="w-14 h-14 rounded-full flex-shrink-0"
            style={{ background: data.avatarBg || (isDark ? "#333" : "#ddd") }}
          />
        )}
        <div className="flex-1 min-w-0 flex flex-col gap-[3px]">
          <span
            className="font-rethink text-[15px] font-bold leading-[21px] truncate"
            style={{ color: isDark ? "#ffffff" : "#000000" }}
          >
            {data.username}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="font-rethink text-[14px] leading-[18px] truncate"
              style={{ color: isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)" }}
            >
              {data.message}
            </span>
            <span className="flex-shrink-0 font-rethink text-[14px] leading-[18px]"
              style={{ color: isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)" }}
            >
              · {data.time}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
