import type { MouseEvent, ReactNode, TouchEvent } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import {
  IconBookmarkFilled,
  IconBookmarkOutline,
  IconBubbleEllipsis,
  IconLikeFilled,
  IconLikeOutline,
  IconPen,
} from "../components/LikeEngagementIcons";
import {
  IconArrowTurnUpRight,
  IconEllipsisVertical,
  IconHeaderBack,
  IconPlusSmall,
} from "../components/LikeHeaderIcons";
import { useTheme } from "../hooks/useTheme";
import { AvatarImg } from "../components/AvatarImg";
import { DEFAULT_PROFILE_PICTURES } from "../utils/profileAvatars";

const LIKE_ACTIVE_RED = "#FF3B30";
const BOOKMARK_GOLD = "#EAB308";
const FLY_HEART_PX = 112;
const PILL_HEART_PX = 16;
const FLY_END_SCALE = PILL_HEART_PX / FLY_HEART_PX;

/** Big-heart fly timeline (ms): burst → hold at full size → fly to pill → fade */
const FLY_ANIM_BURST_MS = 200;
const FLY_ANIM_HOLD_MS = 500;
const FLY_ANIM_FLY_MS = 520;
const FLY_ANIM_FADE_MS = 100;
const FLY_ANIM_TOTAL_MS = FLY_ANIM_BURST_MS + FLY_ANIM_HOLD_MS + FLY_ANIM_FLY_MS + FLY_ANIM_FADE_MS;
/** When the flying heart hits the pill (before fade-out). */
const FLY_ANIM_LAND_AT_MS = FLY_ANIM_BURST_MS + FLY_ANIM_HOLD_MS + FLY_ANIM_FLY_MS;

function formatSaveCount(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  const s = Number.isInteger(k) ? String(k) : k.toFixed(1).replace(/\.0$/, "");
  return `${s}k`;
}

/**
 * Feed article + engagement — from Figma MVP node 4571:314944 (402×874).
 */
export function LikePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1);
  const [heartAnimKey, setHeartAnimKey] = useState(0);

  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(2200);
  const [bookmarkAnimKey, setBookmarkAnimKey] = useState(0);

  const [flySession, setFlySession] = useState<number | null>(null);
  const lastArticleTapRef = useRef<{ t: number; x: number; y: number } | null>(null);
  const articleAreaRef = useRef<HTMLDivElement>(null);
  const likeIconTargetRef = useRef<HTMLSpanElement>(null);
  const flyHeartRef = useRef<HTMLDivElement>(null);
  const flyAnimRef = useRef<Animation | null>(null);
  /** If true, land animation applies like + count + pill pop (double-tap started while outline). */
  const applyLikeOnLandRef = useRef(false);
  const likedRef = useRef(liked);
  likedRef.current = liked;
  const flySessionIdRef = useRef(0);
  /** Viewport coords where the double-tap / double-click happened (burst origin). */
  const flyOriginRef = useRef({ x: 0, y: 0 });

  const triggerDoubleTapLike = useCallback((clientX: number, clientY: number) => {
    applyLikeOnLandRef.current = !liked;
    flyOriginRef.current = { x: clientX, y: clientY };
    flySessionIdRef.current += 1;
    setFlySession(flySessionIdRef.current);
  }, [liked]);

  function handleArticleDoubleClick(e: MouseEvent<HTMLDivElement>) {
    triggerDoubleTapLike(e.clientX, e.clientY);
  }

  function handleArticleTouchEnd(e: TouchEvent<HTMLDivElement>) {
    const touch = e.changedTouches[0];
    const now = Date.now();
    const x = touch.clientX;
    const y = touch.clientY;
    const prev = lastArticleTapRef.current;
    if (prev && now - prev.t < 320) {
      const dx = x - prev.x;
      const dy = y - prev.y;
      if (dx * dx + dy * dy < 55 * 55) {
        triggerDoubleTapLike(x, y);
        lastArticleTapRef.current = null;
        return;
      }
    }
    lastArticleTapRef.current = { t: now, x, y };
  }

  useLayoutEffect(() => {
    if (flySession == null) return;

    const targetEl = likeIconTargetRef.current;
    const flyEl = flyHeartRef.current;
    if (!targetEl || !flyEl) {
      applyLikeOnLandRef.current = false;
      setFlySession(null);
      return;
    }

    flyAnimRef.current?.cancel();

    const tr = targetEl.getBoundingClientRect();
    const { x: sx, y: sy } = flyOriginRef.current;
    const ex = tr.left + tr.width / 2;
    const ey = tr.top + tr.height / 2;

    const sessionId = flySession;

    const oBurst = FLY_ANIM_BURST_MS / FLY_ANIM_TOTAL_MS;
    const oHoldEnd = (FLY_ANIM_BURST_MS + FLY_ANIM_HOLD_MS) / FLY_ANIM_TOTAL_MS;
    const oLand =
      (FLY_ANIM_BURST_MS + FLY_ANIM_HOLD_MS + FLY_ANIM_FLY_MS) / FLY_ANIM_TOTAL_MS;

    const keyframes: Keyframe[] = [
      {
        transform: `translate(${sx}px, ${sy}px) translate(-50%, -50%) scale(0.35) rotate(12deg)`,
        opacity: 0,
      },
      {
        transform: `translate(${sx}px, ${sy}px) translate(-50%, -50%) scale(1) rotate(12deg)`,
        opacity: 1,
        offset: oBurst,
      },
      {
        transform: `translate(${sx}px, ${sy}px) translate(-50%, -50%) scale(1) rotate(12deg)`,
        opacity: 1,
        offset: oHoldEnd,
      },
      {
        transform: `translate(${ex}px, ${ey}px) translate(-50%, -50%) scale(${FLY_END_SCALE}) rotate(0deg)`,
        opacity: 1,
        offset: oLand,
      },
      {
        transform: `translate(${ex}px, ${ey}px) translate(-50%, -50%) scale(${FLY_END_SCALE}) rotate(0deg)`,
        opacity: 0,
        offset: 1,
      },
    ];

    const anim = flyEl.animate(keyframes, {
      duration: FLY_ANIM_TOTAL_MS,
      /* Linear so keyframe offsets match real time — pill fills exactly when fly segment ends. */
      easing: "linear",
      fill: "forwards",
    });
    flyAnimRef.current = anim;

    const landTimer = window.setTimeout(() => {
      if (flySessionIdRef.current !== sessionId) return;
      if (!applyLikeOnLandRef.current) return;
      applyLikeOnLandRef.current = false;
      if (!likedRef.current) {
        setLiked(true);
        setLikeCount((c) => c + 1);
        setHeartAnimKey((k) => k + 1);
      }
    }, FLY_ANIM_LAND_AT_MS);

    anim.onfinish = () => {
      flyAnimRef.current = null;
      if (flySessionIdRef.current === sessionId) {
        setFlySession(null);
        if (applyLikeOnLandRef.current && !likedRef.current) {
          applyLikeOnLandRef.current = false;
          setLiked(true);
          setLikeCount((c) => c + 1);
          setHeartAnimKey((k) => k + 1);
        } else {
          applyLikeOnLandRef.current = false;
        }
      }
    };

    return () => {
      window.clearTimeout(landTimer);
      anim.cancel();
    };
  }, [flySession]);

  function toggleLike() {
    if (liked) {
      setLiked(false);
      setLikeCount((c) => Math.max(1, c - 1));
    } else {
      setLiked(true);
      setLikeCount((c) => c + 1);
      setHeartAnimKey((k) => k + 1);
    }
  }

  function toggleSave() {
    if (saved) {
      setSaved(false);
      setSaveCount((c) => Math.max(0, c - 1));
    } else {
      setSaved(true);
      setSaveCount((c) => c + 1);
      setBookmarkAnimKey((k) => k + 1);
    }
  }

  const outerBg = isDark ? "#000000" : "#F2F2F2";
  const screen = isDark ? "#000000" : "#F2F2F2";
  const card = isDark ? "#181818" : "#FFFFFF";
  const text = isDark ? "#FFFFFF" : "#1D1D1B";
  const meta = isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(29, 29, 27, 0.55)";
  const pillBg = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)";
  const placeholder = isDark ? "rgba(255, 255, 255, 0.34)" : "rgba(29, 29, 27, 0.45)";
  /** Figma: circular “+” chip behind add */
  const plusCircleBg = isDark ? "#1C1C1E" : "rgba(0, 0, 0, 0.08)";

  const icon = text;

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: outerBg }}>
      {flySession != null ? (
        <div
          className="fixed inset-0 z-[300] pointer-events-none flex items-start justify-start"
          aria-hidden
        >
          <div
            ref={flyHeartRef}
            className="absolute left-0 top-0"
            style={{
              width: FLY_HEART_PX,
              height: FLY_HEART_PX,
              willChange: "transform, opacity",
            }}
          >
            <IconLikeFilled color={LIKE_ACTIVE_RED} size={FLY_HEART_PX} />
          </div>
        </div>
      ) : null}
      <div className="phone relative w-full max-w-full h-dvh md:inline-block md:w-auto md:max-w-[90vw] md:max-h-[90vh] md:h-auto">
        <img
          src={`${import.meta.env.BASE_URL}Image/Phone.png`}
          alt="Phone"
          className="hidden md:block w-auto h-auto max-w-[90vw] max-h-[90vh] relative z-2 pointer-events-none"
        />
        <div
          className="hidden md:block absolute z-0 rounded-[56px] overflow-hidden"
          style={{ top: 6, left: 6, right: 6, bottom: 6, background: screen }}
        />
        <div
          className="phone-container flex flex-col overflow-hidden font-rethink"
          data-theme={theme}
          style={{ background: screen, color: text }}
        >
          <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Nav header — Figma: back | centered avatar + name + add | more + share */}
            <nav
              className="flex-shrink-0 grid grid-cols-[1fr_auto_1fr] items-center gap-x-1 min-h-12 px-3 pb-1"
              style={{
                paddingTop: "max(12px, calc(env(safe-area-inset-top, 0px) + 12px))",
              }}
            >
              <div className="flex justify-start min-w-0">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-transparent border-none cursor-pointer p-0 touch-manipulation"
                  aria-label="Back"
                >
                  <IconHeaderBack color={icon} size={24} />
                </button>
              </div>
              <div className="flex justify-center min-w-0 max-w-full">
                <div className="flex items-center gap-2 min-w-0 max-w-[min(100%,220px)]">
                  <AvatarImg
                    src={DEFAULT_PROFILE_PICTURES[0]!}
                    alt=""
                    bgSeed="alcov.co"
                    className={`h-7 w-7 rounded-full flex-shrink-0 object-cover ring-1 ${
                      isDark ? "ring-white/10" : "ring-black/10"
                    }`}
                  />
                  <span className="font-bold text-[15px] leading-tight tracking-[-0.01em] truncate">
                    alcov.co
                  </span>
                  <button
                    type="button"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-none cursor-pointer p-0 touch-manipulation"
                    aria-label="Add"
                  >
                    <IconPlusSmall circleFill={plusCircleBg} plusColor={icon} size={24} />
                  </button>
                </div>
              </div>
              <div className="flex justify-end items-center min-w-0">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-transparent border-none cursor-pointer p-0 touch-manipulation"
                  aria-label="More"
                >
                  <IconEllipsisVertical color={icon} size={24} />
                </button>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-transparent border-none cursor-pointer p-0 touch-manipulation"
                  aria-label="Share"
                >
                  <IconArrowTurnUpRight color={icon} size={24} />
                </button>
              </div>
            </nav>

            {/* Card fills space between nav and engagement; article body scrolls inside */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden px-2 pt-2 pb-5">
              <article
                className="flex flex-1 min-h-0 flex-col rounded-[36px] mx-auto w-full max-w-[386px] overflow-hidden"
                style={{ background: card }}
              >
                <div
                  ref={articleAreaRef}
                  className="relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-6 pt-8 pb-6 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch] touch-manipulation"
                  onDoubleClick={handleArticleDoubleClick}
                  onTouchEnd={handleArticleTouchEnd}
                  role="presentation"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-5">
                      <h1 className="font-bold text-[24px] leading-[1.3] tracking-[0.01em] sm:text-[28px] md:text-[30px]">
                        Why 90% of Short Videos Die in the First 2 Seconds: How Weak Hooks, Low Visual
                      </h1>
                      <div className="flex flex-wrap items-center gap-2 text-[14px] leading-[1.3]" style={{ color: meta }}>
                        <span>4 min read</span>
                        <span className="h-1 w-1 rounded-full flex-shrink-0" style={{ background: meta }} aria-hidden />
                        <span>3 days ago</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6 font-charter text-[18px] leading-[1.8]">
                      <p>
                        I’ve been through 3 rounds of layoffs (twice in HR, once when I was also laid off), and
                        there’s a pattern that emerges before the axe falls.
                      </p>
                      <p>
                        Not trying to create paranoia, but if you’re seeing multiple signs on this list, it might be
                        time to update your resume. This got long, so I’ve broken it down by timeline and severity.
                      </p>
                      <p>
                        This got long, so I’ve broken it down by timeline and severity. Hopefully this helps someone
                        see what’s coming and prepare accordingly. Hopefully this helps the rest of us.
                      </p>
                      <p>
                        Not trying to create paranoia, but if you’re seeing multiple signs on this list, it might be
                        time to update your resume.
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Engagement bar (Figma Bottom / Engagement) */}
            <div
              className="flex-shrink-0 px-6 pt-3 flex flex-col gap-2.5"
              style={{
                background: screen,
                paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
              }}
            >
              <div className="flex items-center gap-2 w-full">
                <div
                  className="flex flex-1 min-w-0 items-center gap-2 h-10 rounded-[100px] px-3"
                  style={{ background: pillBg }}
                >
                  <span className="flex-shrink-0 flex items-center justify-center">
                    <IconPen color={placeholder} size={16} />
                  </span>
                  <span className="text-[13px] leading-[1.3] truncate" style={{ color: placeholder }}>
                    Comment...
                  </span>
                </div>
                <div className="flex w-[15rem] shrink-0 gap-2 min-w-0">
                  <button
                    type="button"
                    className="flex h-10 min-w-0 flex-1 items-center justify-center gap-1 rounded-[36px] px-1.5 border-none cursor-pointer touch-manipulation"
                    style={{
                      background: pillBg,
                      color: text,
                    }}
                    aria-pressed={liked}
                    aria-label={liked ? "Unlike" : "Like"}
                    onClick={toggleLike}
                  >
                    <span
                      ref={likeIconTargetRef}
                      className="flex h-4 w-4 flex-shrink-0 items-center justify-center"
                    >
                      {liked ? (
                        <span key={heartAnimKey} className="inline-flex like-heart-pop">
                          <IconLikeFilled color={LIKE_ACTIVE_RED} size={16} />
                        </span>
                      ) : (
                        <IconLikeOutline color={icon} size={16} />
                      )}
                    </span>
                    <span className="min-w-[0.6em] text-center text-[14px] font-medium leading-[1.3] tabular-nums">
                      {likeCount}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="flex h-10 min-w-0 flex-1 items-center justify-center gap-1 rounded-[36px] px-1.5 border-none cursor-pointer touch-manipulation"
                    style={{
                      background: pillBg,
                      color: text,
                    }}
                    aria-pressed={saved}
                    aria-label={saved ? "Remove save" : "Save"}
                    onClick={toggleSave}
                  >
                    <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
                      {saved ? (
                        <span key={bookmarkAnimKey} className="inline-flex like-heart-pop">
                          <IconBookmarkFilled color={BOOKMARK_GOLD} size={16} />
                        </span>
                      ) : (
                        <IconBookmarkOutline color={icon} size={16} />
                      )}
                    </span>
                    <span className="min-w-[0.6em] text-center text-[14px] font-medium leading-[1.3] tabular-nums">
                      {formatSaveCount(saveCount)}
                    </span>
                  </button>
                  <EngagementPill pillBg={pillBg} label="198" glyph={<IconBubbleEllipsis color={icon} size={16} />} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EngagementPill({ glyph, label, pillBg }: { glyph: ReactNode; label: string; pillBg: string }) {
  return (
    <div
      className="flex h-10 min-w-0 flex-1 items-center justify-center gap-1 rounded-[36px] px-1.5"
      style={{ background: pillBg }}
    >
      <span className="flex flex-shrink-0 items-center justify-center">{glyph}</span>
      <span className="min-w-0 truncate text-center text-[14px] font-medium leading-[1.3] tabular-nums">
        {label}
      </span>
    </div>
  );
}
