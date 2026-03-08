import { Suspense, useMemo, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { inspirations } from "../inspirations/registry";
import type { Inspiration } from "../inspirations/types";

function groupBy(items: Inspiration[]): Record<string, Inspiration[]> {
  const groups: Record<string, Inspiration[]> = {};
  for (const item of items) {
    (groups[item.group] ??= []).push(item);
  }
  return groups;
}

function MediaPreview({ src, replayKey }: { src: string; replayKey: number }) {
  const isVideo = src.endsWith(".mp4") || src.endsWith(".webm");
  if (isVideo) {
    return (
      <video
        key={replayKey}
        src={src}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-contain"
      />
    );
  }
  return (
    <img
      key={replayKey}
      src={`${src}?r=${replayKey}`}
      alt=""
      className="w-full h-full object-contain"
    />
  );
}

function InspirationCard({ item, isDark }: { item: Inspiration; isDark: boolean }) {
  const [replayKey, setReplayKey] = useState(0);
  const Component = item.component;
  return (
    <div
      className={`rounded-2xl overflow-hidden transition-colors ${
        isDark
          ? "bg-[#2c2c2c] shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
          : "bg-white shadow-[0_1px_6px_rgba(0,0,0,0.06)]"
      }`}
    >
      <div
        className={`h-96 overflow-hidden border-b ${
          isDark ? "border-[rgba(255,255,255,0.06)]" : "border-[rgba(0,0,0,0.04)]"
        }`}
      >
        {item.media ? (
          <MediaPreview src={item.media} replayKey={replayKey} />
        ) : Component ? (
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center text-sm opacity-40">
                Loading...
              </div>
            }
          >
            <Component key={replayKey} />
          </Suspense>
        ) : null}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3
            className={`text-[15px] font-semibold m-0 ${
              isDark ? "text-[#ebebeb]" : "text-[#37352f]"
            }`}
          >
            {item.title}
          </h3>
          <button
            onClick={() => setReplayKey((k) => k + 1)}
            aria-label="Replay animation"
            className={`w-7 h-7 rounded-full border-none cursor-pointer flex items-center justify-center text-sm shrink-0 transition-colors ${
              isDark
                ? "bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.15)] text-[#9b9b9b]"
                : "bg-[rgba(0,0,0,0.04)] hover:bg-[rgba(0,0,0,0.08)] text-[#787774]"
            }`}
          >
            ↻
          </button>
        </div>
        <p
          className={`text-[13px] mt-1.5 mb-0 leading-relaxed ${
            isDark ? "text-[#9b9b9b]" : "text-[#787774]"
          }`}
        >
          {item.description}
        </p>
        {item.source.startsWith("http") ? (
          <a
            href={item.source}
            target="_blank"
            rel="noopener noreferrer"
            className={`block text-[11px] mt-2 mb-0 no-underline hover:underline ${
              isDark ? "text-[#5a5a5a] hover:text-[#9b9b9b]" : "text-[#b4b4b0] hover:text-[#787774]"
            }`}
          >
            Source ↗
          </a>
        ) : (
          <p
            className={`text-[11px] mt-2 mb-0 ${
              isDark ? "text-[#5a5a5a]" : "text-[#b4b4b0]"
            }`}
          >
            {item.source}
          </p>
        )}
      </div>
    </div>
  );
}

export function InspirationPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const grouped = useMemo(() => groupBy(inspirations), []);

  if (inspirations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 opacity-40 text-sm">
        No inspirations yet. Ask me to generate some!
      </div>
    );
  }

  return (
    <div className="px-4 pb-8 pt-2 md:px-6">
      {Object.entries(grouped).map(([group, items]) => (
        <section key={group} className="mb-8">
          <h2
            className={`text-[13px] font-semibold uppercase tracking-wider mb-3 ${
              isDark ? "text-[#5a5a5a]" : "text-[#b4b4b0]"
            }`}
          >
            {group}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <InspirationCard key={item.id} item={item} isDark={isDark} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
