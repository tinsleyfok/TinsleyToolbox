import { useTheme } from "../hooks/useTheme";
import { AvatarImg } from "./AvatarImg";

export interface MessageData {
  id: string;
  username: string;
  message: string;
  time: string;
  avatarBg?: string;
  avatarUrl?: string;
}

export function MessageItem({
  data,
  variant = "v1",
}: {
  data: MessageData;
  variant?: "v1" | "mvp";
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sub = isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)";
  const dot = isDark ? "rgba(255,255,255,0.48)" : "rgba(0,0,0,0.48)";
  const name = isDark ? "#ffffff" : "#000000";

  if (variant === "mvp") {
    return (
      <button
        type="button"
        className="box-border flex h-20 w-full cursor-pointer items-center gap-3 border-none bg-transparent px-4 text-left"
      >
        {data.avatarUrl ? (
          <AvatarImg
            src={data.avatarUrl}
            alt=""
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-1 ring-black/[0.12] dark:ring-white/[0.12]"
          />
        ) : (
          <div
            className="h-14 w-14 shrink-0 rounded-full ring-1 ring-black/[0.12] dark:ring-white/[0.12]"
            style={{ background: data.avatarBg || (isDark ? "#333" : "#ddd") }}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <span className="truncate font-rethink text-[15px] font-bold leading-[1.4]" style={{ color: name }}>
            {data.username}
          </span>
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="min-w-0 truncate font-rethink text-[14px] leading-[1.3]" style={{ color: sub }}>
              {data.message}
            </span>
            <span
              className="h-0.5 w-0.5 shrink-0 rounded-full"
              style={{ background: dot }}
              aria-hidden
            />
            <span className="shrink-0 font-rethink text-[14px] leading-[1.3]" style={{ color: sub }}>
              {data.time}
            </span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-center border-none bg-transparent px-4 py-3 text-left"
    >
      <div className="flex w-full items-center gap-3">
        {data.avatarUrl ? (
          <AvatarImg src={data.avatarUrl} alt="" className="h-14 w-14 shrink-0 rounded-full object-cover" />
        ) : (
          <div
            className="h-14 w-14 shrink-0 rounded-full"
            style={{ background: data.avatarBg || (isDark ? "#333" : "#ddd") }}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
          <span className="truncate font-rethink text-[15px] font-bold leading-[21px]" style={{ color: name }}>
            {data.username}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="truncate font-rethink text-[14px] leading-[18px]" style={{ color: sub }}>
              {data.message}
            </span>
            <span className="shrink-0 font-rethink text-[14px] leading-[18px]" style={{ color: sub }}>
              · {data.time}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
