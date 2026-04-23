import { Suspense } from "react";
import { Link } from "react-router";
import { FileItem } from "../components/FileItem";
import { useTheme } from "../hooks/useTheme";
import { inspirations } from "../inspirations/registry";
import type { Inspiration } from "../inspirations/types";

const GIFT_REFERRAL_GROUP = "Gift & Referral";

function sourceLinkLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return `${host} ↗`;
  } catch {
    return "Source ↗";
  }
}

function GiftReferralInspirationCard({ item, isDark }: { item: Inspiration; isDark: boolean }) {
  const media = item.media;
  const Component = item.component;
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border ${
        isDark
          ? "border-white/[0.08] bg-[#1f1f1f]"
          : "border-black/[0.06] bg-white"
      }`}
    >
      <div className={`relative aspect-[9/16] max-h-[200px] w-full overflow-hidden ${isDark ? "bg-black/40" : "bg-black/[0.04]"}`}>
        {media ? (
          <video
            src={media}
            autoPlay
            muted
            playsInline
            loop
            preload="metadata"
            className="h-full w-full object-cover object-top"
          />
        ) : Component ? (
          <Suspense
            fallback={
              <div className={`flex h-full items-center justify-center text-[11px] ${isDark ? "text-white/35" : "text-black/35"}`}>
                Loading…
              </div>
            }
          >
            <div className="h-full w-full overflow-hidden [&>div]:h-full [&>div]:max-h-[200px]">
              <Component />
            </div>
          </Suspense>
        ) : null}
      </div>
      <div className="flex flex-col gap-1 p-2.5">
        <p className={`m-0 text-[13px] font-medium leading-snug ${isDark ? "text-[#ebebeb]" : "text-[#37352f]"}`}>
          {item.title}
        </p>
        <p className={`m-0 text-[11px] leading-snug line-clamp-2 ${isDark ? "text-white/45" : "text-black/45"}`}>
          {item.description}
        </p>
        <a
          href={item.source}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-[11px] font-medium no-underline ${isDark ? "text-sky-400 hover:underline" : "text-sky-600 hover:underline"}`}
        >
          {sourceLinkLabel(item.source)}
        </a>
      </div>
    </div>
  );
}

export function AnimationPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const giftReferral = inspirations.filter((i) => i.group === GIFT_REFERRAL_GROUP);

  return (
    <div className="flex w-full flex-col gap-0 pt-2 md:gap-8 md:p-5 md:px-6">
      <div className="flex flex-col gap-0 md:flex-row md:flex-wrap md:gap-5">
        <FileItem to="/animation/onboarding" title="Onboarding: Interest Distribution" />
        <FileItem to="/animation/flip-card" title="Flip card" />
        <FileItem to="/animation/like" title="Like" emptyPreview />
        <FileItem to="/animation/splash" title="Splash" emptyPreview />
        <FileItem to="/animation/referral-entry" title="Referral entry" emptyPreview />
      </div>

      <section className="mt-6 border-t px-4 pt-6 md:mt-0 md:border-t-0 md:px-0 md:pt-0" style={{ borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(55,53,47,0.08)" }}>
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className={`m-0 text-[15px] font-semibold ${isDark ? "text-[#ebebeb]" : "text-[#37352f]"}`}>
            Gift &amp; referral — inspiration
          </h2>
          <Link
            to="/inspiration/animations"
            className={`text-[13px] font-medium no-underline ${isDark ? "text-sky-400 hover:underline" : "text-sky-600 hover:underline"}`}
          >
            All animation inspiration →
          </Link>
        </div>
        <p className={`mb-4 mt-0 text-[12px] ${isDark ? "text-white/45" : "text-black/45"}`}>
          App recordings from{" "}
          <a href="https://60fps.design" target="_blank" rel="noopener noreferrer" className="text-inherit underline">
            60fps.design
          </a>
          , flow galleries such as{" "}
          <a href="https://mobbin.com/explore/mobile/flows/gifting" target="_blank" rel="noopener noreferrer" className="text-inherit underline">
            Mobbin (gifting)
          </a>
          , plus a few interactive demos when there is no clip in-repo.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {giftReferral.map((item) => (
            <GiftReferralInspirationCard key={item.id} item={item} isDark={isDark} />
          ))}
        </div>
      </section>
    </div>
  );
}
