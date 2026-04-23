import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Lottie from "lottie-react";
import { useTheme } from "../hooks/useTheme";
import { ProfileHeader } from "../components/ProfileHeader";
import { FeedCard, type FeedCardData } from "../components/FeedCard";
import { publicUrl, tinsleyProfilePhoto } from "../utils/publicAsset";
import shakeLottieDark from "../../public/Animation/Shake.dark.json";
import shakeLottieLight from "../../public/Animation/Shake.light.json";
import couponLottieDark from "../../public/Animation/Coupon.dark.json";
import couponLottieLight from "../../public/Animation/Coupon.json";
import referralLottieDark from "../../public/Animation/referral.dark.json";
import referralLottieLight from "../../public/Animation/referral.json";

/**
 * Profile screen with a Gift icon in the nav bar as the referral entry.
 * Uses the `/animation/*` `.phone-container` shell but overrides `bottom` to 6px
 * so the scrollable card grid extends to the phone's bottom bezel — matching
 * the MVP Profile feel, no gray strip between content and the phone frame.
 * Figma 259ioVdLDy89hhmXvUh0Yy / 429:18784.
 */

const TABS = ["My Card", "Saves", "Likes"] as const;

const ACCENT = "#EC652B";

/** From `public/Icon/gift/Dollar_Sign_Fill.svg` (12×12). Inlined so it paints like other paths — `<image href>` can vanish under GPU compositing inside `.phone-container` (translateZ + overflow). */
const DOLLAR_PATH_12 =
  "M6 0.5C9.03757 0.5 11.5 2.96243 11.5 6C11.5 9.03757 9.03757 11.5 6 11.5C2.96243 11.5 0.5 9.03757 0.5 6C0.5 2.96243 2.96243 0.5 6 0.5ZM5.60254 2.5V3.2915C4.72189 3.44459 4.14651 4.0121 4.14648 4.81445C4.14648 5.54944 4.60853 6.03242 5.34351 6.24243L6.32007 6.52588C6.83453 6.67288 7.02343 6.9145 7.02344 7.30298C7.02344 7.79645 6.68754 8.04855 6.09961 8.04858C5.46962 8.04858 5.07059 7.744 4.91309 7.03003L3.85254 7.28198C4.05239 8.24491 4.69243 8.75161 5.60254 8.87085V9.5H6.60254V8.85547C7.54185 8.70028 8.14697 8.13453 8.14697 7.23999C8.14697 6.30551 7.60096 5.89604 6.77148 5.65454L5.84766 5.39209C5.44866 5.26609 5.25952 5.06647 5.25952 4.71997C5.25954 4.36299 5.54313 4.11108 6.06812 4.11108C6.59302 4.11112 6.91843 4.34204 7.09692 4.84595L8.14697 4.573C7.96338 3.81243 7.39404 3.40127 6.60254 3.28491V2.5H5.60254Z";

const DOLLAR_FILL = "#FF6030";

/** Nav gift icon animation — selected in the floating picker (icon-only). */
/** Variant ids align with picker copy (`GIFT_OPTIONS`). */
export type GiftAnimVariant = "bounce" | "sparkle" | "reveal" | "shake" | "coupon" | "referral";

const feedImg = (file: string) => publicUrl(`images/${file}`);
const myAvatar = tinsleyProfilePhoto;

const MY_CARDS_LEFT: FeedCardData[] = [
  {
    id: "r-l1",
    variant: "draft",
    size: "landscape",
    title: "Drafts",
    username: "",
    likes: "",
    imageUrl: feedImg("feed-decor2.jpg"),
  },
  {
    id: "r-l2",
    variant: "image",
    size: "landscape",
    title: "My favorite beach is laguna beach!!!",
    username: "tinsleyfok",
    likes: "3.9K",
    imageUrl: feedImg("feed-decor1.jpg"),
    avatarUrl: myAvatar,
  },
  {
    id: "r-l3",
    variant: "image",
    size: "landscape",
    title: "Sushi iShikawa @NYC",
    username: "tinsleyfok",
    likes: "3.9K",
    imageUrl: feedImg("feed-food.jpg"),
    avatarUrl: myAvatar,
  },
  {
    id: "r-l4",
    variant: "video",
    size: "landscape",
    title: "The lego I built these years",
    username: "tinsleyfok",
    likes: "12",
    imageUrl: feedImg("feed-beads.png"),
    avatarUrl: myAvatar,
  },
];

const MY_CARDS_RIGHT: FeedCardData[] = [
  {
    id: "r-r1",
    variant: "video",
    size: "portrait",
    title: "Tokyo trip 2025",
    username: "tinsleyfok",
    likes: "1.6K",
    imageUrl: feedImg("feed-chihuahua.png"),
    avatarUrl: myAvatar,
    views: "20,480",
  },
  {
    id: "r-r3",
    variant: "video",
    size: "portrait",
    title: "Fake smile buddy",
    username: "tinsleyfok",
    likes: "1.6K",
    imageUrl: feedImg("feed-cat.jpg"),
    avatarUrl: myAvatar,
  },
  {
    id: "r-r4",
    variant: "image",
    size: "landscape",
    title: "New Mexico - Marfa",
    username: "tinsleyfok",
    likes: "2",
    imageUrl: feedImg("feed-interior.jpg"),
    avatarUrl: myAvatar,
  },
];

function IconBack({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15.5303 4.46967C15.8232 4.76256 15.8232 5.23744 15.5303 5.53033L9.81066 11.25H20.25C20.6642 11.25 21 11.5858 21 12C21 12.4142 20.6642 12.75 20.25 12.75H9.81066L15.5303 18.4697C15.8232 18.7626 15.8232 19.2374 15.5303 19.5303C15.2374 19.8232 14.7626 19.8232 14.4697 19.5303L7.21967 12.2803C6.92678 11.9874 6.92678 11.5126 7.21967 11.2197L14.4697 3.96967C14.7626 3.67678 15.2374 3.67678 15.5303 3.96967Z"
        fill={color}
      />
    </svg>
  );
}

function IconGift({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSettings({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.6052 3.66646C16.9458 3.46607 17.3748 3.49641 17.6838 3.74276L18.7176 4.56684C19.0264 4.81297 19.1516 5.22385 19.0327 5.60038L18.5335 7.18075C19.1346 8.00311 19.5932 8.94875 19.8647 9.98964L21.4155 10.5838C21.7846 10.7252 22.0283 11.0795 22.0284 11.4747L22.0286 12.7967C22.0287 13.1916 21.7855 13.5457 21.417 13.6875L19.8442 14.2925C19.5703 15.2941 19.112 16.233 18.4996 17.0612L19.0063 18.658C19.1258 19.0347 19.0008 19.4461 18.6918 19.6925L17.6583 20.517C17.3497 20.7632 16.9212 20.7939 16.5806 20.5941L15.1319 19.7446C14.6633 19.9485 14.1691 20.1119 13.6526 20.2298C13.1371 20.3475 12.6218 20.4147 12.112 20.4346L11.1918 21.8079C10.9718 22.1362 10.5722 22.295 10.1869 22.2071L8.89794 21.9131C8.51297 21.8252 8.22185 21.5094 8.16566 21.1185L7.93145 19.4895C6.99679 19.0001 6.15708 18.3356 5.464 17.5286L3.85692 17.662C3.46306 17.6947 3.0898 17.4813 2.91829 17.1252L2.34456 15.9341C2.1732 15.5784 2.23865 15.1539 2.50919 14.8663L3.61097 13.695C3.39816 12.6065 3.40841 11.5231 3.611 10.4935L2.52514 9.34188C2.25402 9.05433 2.18822 8.6294 2.35968 8.27332L2.93324 7.08216C3.10454 6.7264 3.47728 6.51289 3.87082 6.54511L5.4614 6.67532C6.1526 5.86678 7.0016 5.18569 7.9753 4.68477L8.19925 3.11384C8.25502 2.72258 8.54622 2.4062 8.93153 2.31823L10.2204 2.02399C10.6054 1.9361 11.0047 2.0944 11.2249 2.42217L12.1266 3.76452C13.2053 3.80658 14.2491 4.05867 15.2071 4.48888L16.6052 3.66646ZM17.4876 10.7999C18.2051 13.9431 16.2388 17.0729 13.0956 17.7904C9.95247 18.508 6.82272 16.5417 6.10515 13.3985C5.38758 10.2553 7.35391 7.12558 10.4971 6.408C13.6402 5.69043 16.77 7.65676 17.4876 10.7999Z"
        fill={color}
      />
    </svg>
  );
}

function IconChevronDown({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1" aria-hidden>
      <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Small 4-point star used by the sparkle variant. */
function Sparkle({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M5 0 L5.9 3.8 L10 5 L5.9 6.2 L5 10 L4.1 6.2 L0 5 L4.1 3.8 Z" fill={color} />
    </svg>
  );
}

/** Applies the chosen looping animation to the nav bar gift and picker previews. */
function AnimatedGiftIcon({
  variant,
  color,
  size = 24,
  isDark = false,
}: {
  variant: GiftAnimVariant;
  color: string;
  size?: number;
  /** Used for theme Lottie assets (`shake`, `coupon`, `referral`). */
  isDark?: boolean;
}) {
  const reduce = useReducedMotion();
  const icon = <IconGift color={color} size={size} />;

  if (reduce) return icon;

  if (variant === "bounce") {
    return (
      <motion.div
        className="flex items-center justify-center will-change-transform"
        style={{ transformOrigin: "50% 100%" }}
        animate={{
          y:      [0,  -size * 0.25,  0,   -size * 0.1,  0,    0],
          scaleX: [1,  0.94,          1.22, 0.98,         1.04, 1],
          scaleY: [1,  1.10,          0.82, 1.04,         0.98, 1],
        }}
        transition={{
          duration: 1.1,
          repeat: Infinity,
          repeatDelay: 1.6,
          times: [0, 0.28, 0.5, 0.72, 0.9, 1],
          ease: "easeOut",
        }}
      >
        {icon}
      </motion.div>
    );
  }

  if (variant === "sparkle") {
    const box = size + 14;
    const sparkles: { dx: number; dy: number; delay: number; s: number }[] = [
      { dx: -size * 0.52, dy: -size * 0.44, delay: 0.0,  s: 0.9 },
      { dx:  size * 0.52, dy: -size * 0.30, delay: 0.45, s: 0.7 },
      { dx: -size * 0.35, dy:  size * 0.48, delay: 0.85, s: 0.6 },
      { dx:  size * 0.44, dy:  size * 0.42, delay: 1.25, s: 0.85 },
    ];
    return (
      <span
        className="relative inline-flex items-center justify-center"
        style={{ width: box, height: box }}
      >
        {sparkles.map((sp, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute"
            style={{ left: "50%", top: "50%", marginLeft: sp.dx - 4, marginTop: sp.dy - 4 }}
            animate={{
              scale: [0, sp.s, 0],
              opacity: [0, 1, 0],
              rotate: [0, 90],
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              delay: sp.delay,
              ease: "easeInOut",
            }}
          >
            <Sparkle size={8} color={ACCENT} />
          </motion.span>
        ))}
        <span className="relative z-[1] inline-flex">{icon}</span>
      </span>
    );
  }

  if (variant === "reveal") {
    const D = 3.4;
    // Fly-out: 0.14→0.24. Dollar pops in 0.24→0.31 (overshoot to 1.3),
    // snaps back to 1.0 at 0.40, holds until 0.65, then closes.
    const T = [0, 0.14, 0.24, 0.31, 0.40, 0.65, 0.75, 1];

    const LID_W = 19.8;
    const LID_H = (LID_W * 12) / 21;
    const BOX_W = (LID_W * 17) / 21;
    const BOX_H = (BOX_W * 13) / 17;
    const BOX_X = (24 - BOX_W) / 2;

    // Positive OVERLAP presses the cover DOWN into the box top (so the two
    // dark outlines merge into a single unified silhouette).
    // Negative OVERLAP lifts the cover ABOVE the box top, leaving a
    // visible seam so the lid reads as a distinct piece sitting on top. We go
    // slightly negative here so cover + box look like two separate objects
    // even at rest, emphasising the "split-apart" reveal.
    const OVERLAP = 0.3;
    // Shift box up by ~1.15 so both lid-top and box-bottom are equally far
    // from the viewBox edges (~1.15 units each). This makes them clip into
    // their respective edges at the same moment → visually synchronous fly-out.
    const BOX_Y = 24 - BOX_H - 1.15;
    const LID_Y = BOX_Y - LID_H * (10.32 / 12) + OVERLAP;

    // Coin is parked at the 24×24 viewport center (12, 12) and ONLY scales in
    // place — no y travel — so through the whole animation its center never
    // moves. Box + lid fly apart around it.
    const COIN = 20;
    const CX = 12;
    const CY = 12;

    const LID_LIFT = -(LID_Y + LID_H + 0.2);
    // Same keyframe times for coin + lid + box; box travels slightly farther down
    // at peak so a hairline gap does not flash between lid and body mid–fly-out.
    const BOX_DROP_EXTRA = 0.8;
    const BOX_DROP = -LID_LIFT + BOX_DROP_EXTRA;

    const revealMotion = {
      duration: D,
      repeat: Infinity,
      repeatDelay: 2,
      ease: "easeOut" as const,
      times: T,
    };

    return (
      <div className="flex items-center justify-center overflow-hidden" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          className="block max-w-none overflow-hidden"
          aria-hidden
        >
          <g transform={`translate(${CX} ${CY})`}>
            {/* No `transform-box: fill-box` here: with `scale: 0` some engines shrink the
                fill box to zero and skip painting the whole coin (picker + phone). */}
            <motion.g
              style={{ transformOrigin: "0px 0px" }}
              animate={{
                scale: [0, 0, 0, 1.3, 1.0, 1.0, 0, 0],
                opacity: [0, 0, 0, 1, 1, 1, 0, 0],
              }}
              transition={revealMotion}
            >
              <g transform={`translate(${-COIN / 2} ${-COIN / 2}) scale(${COIN / 12})`}>
                <path fillRule="evenodd" clipRule="evenodd" d={DOLLAR_PATH_12} fill={DOLLAR_FILL} />
              </g>
            </motion.g>
          </g>

          {/* Box + lid share `revealMotion`. Box peak offset is
              `|LID_LIFT| + BOX_DROP_EXTRA` to hide a sub-pixel seam. */}
          <motion.g
            animate={{ y: [0, 0, BOX_DROP, BOX_DROP, BOX_DROP, BOX_DROP, 0, 0] }}
            transition={revealMotion}
          >
            <g transform={`translate(${BOX_X} ${BOX_Y}) scale(${BOX_W / 17})`}>
              <path d="M17 4.95996C17 4.29417 17.0003 3.7342 16.9629 3.27637C16.9238 2.79771 16.8382 2.34294 16.6182 1.91113C16.2826 1.25262 15.7474 0.717383 15.0889 0.381836C14.6571 0.16182 14.2023 0.07623 13.7236 0.0371094C13.2658 -0.000297546 12.7059 -1.52588e-05 12.04 0H4.95996C4.29408 -1.52588e-05 3.73424 -0.000297546 3.27637 0.0371094C2.79771 0.0762301 2.34294 0.161821 1.91113 0.381836C1.25262 0.717383 0.717384 1.25262 0.381837 1.91113C0.161823 2.34294 0.0762302 2.79771 0.0371104 3.27637C-0.000298789 3.73423 -1.33032e-05 4.2941 1.00646e-06 4.95996V8.5H2V5C2 4.28347 2.00032 3.80616 2.03027 3.43945C2.05924 3.08489 2.11072 2.92228 2.16309 2.81934C2.3069 2.53709 2.53709 2.3069 2.81934 2.16309C2.92228 2.11072 3.0849 2.05924 3.43945 2.03027C3.80616 2.00032 4.28347 2 5 2H7.5V8.5H17V4.95996ZM9.5 2H12C12.7165 2 13.1938 2.00032 13.5605 2.03027C13.9151 2.05924 14.0777 2.11072 14.1807 2.16309C14.4629 2.3069 14.6931 2.53709 14.8369 2.81934C14.8893 2.92228 14.9408 3.08489 14.9697 3.43945C14.9997 3.80616 15 4.28347 15 5V8.5H9.5V2Z" fill={color}/>
              <path d="M17 7.54004C17 8.20583 17.0003 8.7658 16.9629 9.22363C16.9238 9.70229 16.8382 10.1571 16.6182 10.5889C16.2826 11.2474 15.7474 11.7826 15.0889 12.1182C14.6571 12.3382 14.2023 12.4238 13.7236 12.4629C13.2658 12.5003 12.7059 12.5 12.04 12.5H4.95996C4.29408 12.5 3.73424 12.5003 3.27637 12.4629C2.79771 12.4238 2.34294 12.3382 1.91113 12.1182C1.25262 11.7826 0.717384 11.2474 0.381837 10.5889C0.161823 10.1571 0.0762302 9.70229 0.0371104 9.22363C-0.000298789 8.76577 -1.33032e-05 8.2059 1.00646e-06 7.54004V4H2V7.5C2 8.21653 2.00032 8.69384 2.03027 9.06055C2.05924 9.41511 2.11072 9.57772 2.16309 9.68066C2.3069 9.96291 2.53709 10.1931 2.81934 10.3369C2.92228 10.3893 3.0849 10.4408 3.43945 10.4697C3.80616 10.4997 4.28347 10.5 5 10.5H7.5V4H17V7.54004ZM9.5 10.5H12C12.7165 10.5 13.1938 10.4997 13.5605 10.4697C13.9151 10.4408 14.0777 10.3893 14.1807 10.3369C14.4629 10.1931 14.6931 9.96291 14.8369 9.68066C14.8893 9.57772 14.9408 9.41511 14.9697 9.06055C14.9997 8.69384 15 8.21653 15 7.5V4H9.5V10.5Z" fill={color}/>
            </g>
          </motion.g>

          <motion.g
            animate={{ y: [0, 0, LID_LIFT, LID_LIFT, LID_LIFT, LID_LIFT, 0, 0] }}
            transition={revealMotion}
          >
            <g transform={`translate(${CX - LID_W / 2} ${LID_Y}) scale(${LID_W / 21})`}>
              <path d="M15.167 0C17.01 0.000186034 18.4004 1.58222 18.4004 3.40039C18.4003 3.93165 18.2814 4.44309 18.0674 4.90039H19C20.1046 4.90039 21 5.79582 21 6.90039V9.90039C20.9998 11.0048 20.1044 11.9004 19 11.9004L2 11.9004C0.89556 11.9004 0.000211286 11.0048 0 9.90039L0 6.90039C0 5.79582 0.895431 4.90039 2 4.90039L2.93262 4.90039C2.71859 4.44309 2.59967 3.93165 2.59961 3.40039C2.59961 1.58222 3.98997 0.000186034 5.83301 0C7.57469 0 8.79506 0.864835 9.64355 1.99219C9.9762 2.43417 10.2576 2.92319 10.5 3.42578C10.7424 2.92319 11.0238 2.43417 11.3564 1.99219C12.2049 0.864835 13.4253 0 15.167 0ZM2 6.89941V9.89941L9.5 9.89941V6.89941L2 6.89941ZM11.5 6.89941L11.5 9.89941L19 9.89941V6.89941L11.5 6.89941ZM5.83301 1.7998C5.0991 1.8 4.40058 2.45661 4.40039 3.39941C4.40039 4.12531 4.81433 4.68164 5.33984 4.89941L9.18262 4.89941C8.90894 4.2207 8.59414 3.59115 8.20508 3.07422C7.60685 2.27948 6.87478 1.7998 5.83301 1.7998ZM15.167 1.7998C14.1252 1.7998 13.3931 2.27948 12.7949 3.07422C12.4059 3.59115 12.0911 4.2207 11.8174 4.89941H15.6602C16.1857 4.68164 16.5996 4.12531 16.5996 3.39941C16.5994 2.45661 15.9009 1.8 15.167 1.7998Z" fill={color}/>
            </g>
          </motion.g>
        </svg>
      </div>
    );
  }

  if (variant === "shake") {
    const shakeLottie = isDark ? shakeLottieDark : shakeLottieLight;
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <Lottie animationData={shakeLottie} loop style={{ width: size, height: size }} />
      </div>
    );
  }

  if (variant === "coupon") {
    const couponLottie = isDark ? couponLottieDark : couponLottieLight;
    return (
      <div className="flex items-center justify-center overflow-hidden" style={{ width: size, height: size }}>
        <Lottie animationData={couponLottie} loop style={{ width: size, height: size }} />
      </div>
    );
  }

  if (variant === "referral") {
    const referralLottie = isDark ? referralLottieDark : referralLottieLight;
    return (
      <div className="flex items-center justify-center overflow-hidden" style={{ width: size, height: size }}>
        <Lottie animationData={referralLottie} loop style={{ width: size, height: size }} />
      </div>
    );
  }

  return icon;
}

const GIFT_OPTIONS: { id: GiftAnimVariant; title: string }[] = [
  { id: "bounce", title: "Bounce" },
  { id: "sparkle", title: "Sparkle" },
  { id: "reveal", title: "Reveal" },
  { id: "shake", title: "Shake" },
  { id: "coupon", title: "Coupon" },
  { id: "referral", title: "Referral" },
];

/** Human label for any variant — same strings as the picker. */
function giftAnimTitle(v: GiftAnimVariant): string {
  return GIFT_OPTIONS.find((o) => o.id === v)?.title ?? v;
}

function GiftAnimationPicker({
  value,
  onChange,
  isDark,
  /** Same fill as the in-phone gift (`textColor`) so previews match nav. */
  iconColor,
}: {
  value: GiftAnimVariant;
  onChange: (v: GiftAnimVariant) => void;
  isDark: boolean;
  iconColor: string;
}) {
  const cardIdle = isDark
    ? "border border-white/10 hover:border-white/20"
    : "border border-black/10 hover:border-black/18";
  const selectedCard = "border-2 border-[#EC652B]";

  return (
    <fieldset className="w-full min-w-0 shrink-0 space-y-1 border-0 p-0 m-0">
      <legend className="sr-only">Gift icon animation: {GIFT_OPTIONS.map((o) => o.title).join(", ")}</legend>
      <div role="radiogroup" className="flex flex-col gap-1">
        {GIFT_OPTIONS.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.id)}
              className={[
                "w-full rounded-lg px-2 py-1 text-left transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC652B] focus-visible:ring-offset-1",
                isDark ? "focus-visible:ring-offset-black" : "focus-visible:ring-offset-[#f2f2f2]",
                selected ? selectedCard : cardIdle,
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <div className={["flex h-10 w-10 shrink-0 items-center justify-center rounded-md", isDark ? "bg-white/5" : "bg-black/[0.04]"].join(" ")}>
                  <AnimatedGiftIcon variant={opt.id} color={iconColor} size={24} isDark={isDark} />
                </div>
                <span className="min-w-0 flex-1 font-rethink text-[12px] font-semibold leading-tight" style={{ color: isDark ? "#fff" : "#111" }}>
                  {opt.title}
                </span>
                <div
                  className={["flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors", selected ? "border-[#EC652B] bg-[#EC652B]" : "border-black/18 bg-transparent"].join(" ")}
                  aria-hidden
                >
                  {selected && (
                    <svg width="7" height="5" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ReferralEntryPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bgColor = isDark ? "#000000" : "#FAFAFA";
  const pageBg = isDark ? "#000000" : "#f2f2f2";
  const surfaceBg = isDark ? "#0f0f0f" : "#f6f6f6";
  const textColor = isDark ? "#ffffff" : "#000000";

  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("My Card");
  const [giftAnim, setGiftAnim] = useState<GiftAnimVariant>("referral");
  const left = MY_CARDS_LEFT;
  const right = MY_CARDS_RIGHT;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-3 py-6" style={{ background: pageBg }}>
      <div className="relative inline-flex flex-col items-center mx-auto w-full max-w-full md:w-auto">
      <div className="phone relative w-full max-w-full h-dvh md:inline-block md:w-auto md:max-w-[90vw] md:max-h-[90vh] md:h-auto">
        <img
          src={`${import.meta.env.BASE_URL}Image/Phone.png`}
          alt="Phone"
          className="hidden md:block w-auto h-auto max-w-[90vw] max-h-[90vh] relative z-2 pointer-events-none"
        />
        <div
          className="hidden md:block absolute z-0 rounded-[56px] overflow-hidden"
          style={{ top: 6, left: 6, right: 6, bottom: 6, background: bgColor }}
        />
        <div
          className="phone-container referral-entry-screen flex flex-col overflow-hidden"
          data-theme={theme}
          style={{ background: bgColor, bottom: 6 }}
        >
          {/* Nav bar — back | tinsleyfok | gift (referral) + settings */}
          <div
            className="relative z-20 flex shrink-0 items-center justify-between px-3"
            style={{
              minHeight: 48,
              paddingTop: "max(4px, env(safe-area-inset-top, 0px))",
            }}
          >
            <button
              type="button"
              className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center bg-transparent border-0 cursor-pointer"
              aria-label="Back"
            >
              <IconBack color={textColor} />
            </button>
            <h1
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 m-0 -translate-x-1/2 -translate-y-1/2 font-rethink text-[18px] font-bold"
              style={{ color: textColor }}
            >
              tinsleyfok
            </h1>
            <div className="relative z-10 flex items-center gap-0.5">
              <button
                type="button"
                className="isolate flex h-10 w-10 items-center justify-center bg-transparent border-0 cursor-pointer"
                aria-label={`Invite friends — ${giftAnimTitle(giftAnim)}`}
              >
                <AnimatedGiftIcon variant={giftAnim} color={textColor} size={24} isDark={isDark} />
              </button>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center bg-transparent border-0 cursor-pointer"
                aria-label="Settings"
              >
                <IconSettings color={textColor} />
              </button>
            </div>
          </div>

          {/* Scrollable content — fills to the phone's bottom bezel */}
          <div className="relative z-0 min-h-0 flex-1 overflow-y-auto">
            <ProfileHeader avatarSrc={tinsleyProfilePhoto} />

            <div className="rounded-t-[36px] relative" style={{ background: surfaceBg }}>
              <div
                className="absolute top-0 left-0 right-0 h-32 rounded-t-[36px] pointer-events-none"
                style={{
                  background: `linear-gradient(to bottom, ${isDark ? "#1a1a1a" : "#ececec"}, ${surfaceBg})`,
                }}
              />
              <div className="relative z-10 flex items-center h-[50px] px-5">
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
                      {tab === "My Card" && isActive && <IconChevronDown color={textColor} />}
                    </button>
                  );
                })}
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-3 px-2 pt-3 pb-6">
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
        </div>
      </div>
      </div>

      <div
        className="pointer-events-auto absolute z-10 hidden w-[140px] max-w-[min(140px,calc(100vw-1.25rem))] bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] right-[max(0.75rem,env(safe-area-inset-right,0px))] md:block"
      >
        <GiftAnimationPicker
          value={giftAnim}
          onChange={setGiftAnim}
          isDark={isDark}
          iconColor={textColor}
        />
      </div>

      {/* Large inspection preview of the currently selected animation. */}
      <div
        className="hidden"
      >
        <div
          className={[
            "flex h-[240px] w-[240px] items-center justify-center rounded-2xl",
            isDark ? "bg-white/5 border border-white/10" : "bg-black/[0.04] border border-black/10",
          ].join(" ")}
        >
          <AnimatedGiftIcon variant={giftAnim} color={textColor} size={240} isDark={isDark} />
        </div>
        <span
          className="font-rethink text-[11px] font-semibold uppercase tracking-wide opacity-60"
          style={{ color: textColor }}
        >
          Preview · {giftAnimTitle(giftAnim)}
        </span>
      </div>
    </div>
  );
}
