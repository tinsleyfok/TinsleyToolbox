import { useEffect, useRef } from "react";
import { ReelCard, type ReelCardData } from "../components/ReelCard";
import { holoAvatar } from "../utils/holoAvatar";
import { publicUrl, tinsleyProfilePhoto } from "../utils/publicAsset";

const feedImg = (file: string) => publicUrl(`images/${file}`);
const avatar = (seed: string) => holoAvatar(seed);

const MOCK_CARDS: ReelCardData[] = [
  {
    id: "r1",
    variant: "video",
    username: "adrianvvlog",
    avatarUrl: avatar("adrian"),
    imageUrl: feedImg("feed-hvac.jpg"),
    likes: "9.9K",
    comments: "3.4K",
    saves: "1.2K",
    description:
      "How I hid my ugly HVAC panel without blocking airflow. This simple trick changed everything\u2026",
  },
  {
    id: "r2",
    variant: "image",
    username: "tinsleyfok",
    avatarUrl: tinsleyProfilePhoto,
    imageUrl: feedImg("feed-food.jpg"),
    imageAspect: "4:3",
    likes: "3.9K",
    comments: "230",
    saves: "123",
    timestamp: "3 days ago",
  },
  {
    id: "r3",
    variant: "image",
    username: "alcov.co",
    avatarUrl: avatar("alcov"),
    imageUrl: feedImg("feed-booblight.jpg"),
    imageAspect: "1:1",
    likes: "1.2k",
    comments: "230",
    saves: "123",
    description:
      "I finally fixed the UGLY \u201cboob light\u201d in my rental! Here\u2019s a quick before and after\u2026",
  },
  {
    id: "r4",
    variant: "discussion",
    username: "rockingao",
    avatarUrl: avatar("rocking"),
    title: "Which profession is going to get wiped out in the next 5\u201310 years?",
    likes: "2.9K",
    comments: "346",
    saves: "1.2k",
    timestamp: "3 days ago",
    description: "AI is advancing at a pace that makes it feel like non-senior SWE roles are basically doomed. When tools can generate features, refactor code\u2026",
  },
  {
    id: "r5",
    variant: "article",
    username: "Significant_Soup2558",
    avatarUrl: avatar("soup"),
    title: "Former HR Here: Subtle Signs Your Company Is Preparing for Layoffs",
    body: "I\u2019ve been through 3 rounds of layoffs (twice in HR, once when I was also laid off), and there\u2019s a pattern that emerges before the axe falls.\n\nLayoffs rarely happen overnight; they\u2019re usually the result of months of decisions and signals. Looking back, the signs were often there: hiring freezes, sudden budget scrutiny, leadership becoming vague about roadmap priorities.",
    readTime: "4 min read",
    likes: "991",
    comments: "346",
    saves: "1.2k",
    timestamp: "3 days ago",
  },
  {
    id: "r6",
    variant: "video",
    username: "baoyue999",
    avatarUrl: avatar("baoyue"),
    imageUrl: feedImg("living-room.png"),
    likes: "12.9K",
    comments: "1.1K",
    saves: "3.2K",
    description: "Morning light in my apartment renovation \u2728 the before/after is insane",
  },
  {
    id: "r7",
    variant: "image",
    username: "C~A~T~A~R~I~N",
    avatarUrl: avatar("catarin"),
    imageUrl: feedImg("feed-cat.jpg"),
    imageAspect: "1:1",
    likes: "110",
    comments: "892",
    saves: "1.5K",
    description: "My babe Fanin",
  },
  {
    id: "r8",
    variant: "video",
    username: "baoyue999",
    avatarUrl: avatar("baoyue"),
    imageUrl: feedImg("feed-living.jpg"),
    likes: "4.2K",
    comments: "156",
    saves: "890",
    description:
      "10 ways to decorate your living room in a modern way \u2014 number 3 will blow your mind.",
  },
  {
    id: "r9",
    variant: "article",
    username: "nyc.reality",
    avatarUrl: avatar("nyc"),
    title: "The Real Cost of Living in NYC as a 25-Year-Old",
    body: "Everyone talks about the high rent but nobody mentions the $18 salads, $7 coffees, and the fact that you\u2019ll spend $150/month just on laundry.\n\nHere\u2019s my actual monthly breakdown after 2 years in Manhattan.",
    readTime: "6 min read",
    likes: "6.8K",
    comments: "1.2K",
    saves: "4.1K",
    timestamp: "1 week ago",
  },
];

export function SingleColumnFeedPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const scrollEl = containerRef.current?.closest(".app-content") as HTMLElement | null;
    if (!scrollEl) return;

    scrollEl.classList.add("reel-scroll");

    function updateCards() {
      if (!scrollEl) return;
      const vpCenter = scrollEl.scrollTop + scrollEl.clientHeight / 2;
      const maxDist = scrollEl.clientHeight * 0.55;

      cardRefs.current.forEach((el) => {
        if (!el) return;
        const cardCenter = el.offsetTop + el.offsetHeight / 2;
        const dist = Math.abs(cardCenter - vpCenter);
        const t = Math.min(dist / maxDist, 1);

        const scale = 1 - t * 0.1;
        const opacity = 1 - t * 0.65;
        el.style.transform = `scale(${scale})`;
        el.style.opacity = `${opacity}`;
      });
    }

    let raf: number;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateCards);
    }

    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    updateCards();

    return () => {
      scrollEl.removeEventListener("scroll", onScroll);
      scrollEl.classList.remove("reel-scroll");
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center px-2"
      style={{ gap: 36, paddingTop: "30vh", paddingBottom: "30vh" }}
    >
      {MOCK_CARDS.map((card, i) => (
        <div
          key={card.id}
          ref={(el) => { cardRefs.current[i] = el; }}
          className="reel-card w-full"
        >
          <ReelCard card={card} />
        </div>
      ))}
    </div>
  );
}
