import { useEffect, useRef } from "react";
import { ReelCard, type ReelCardData } from "../components/ReelCard";

const img = (id: number, w = 400, h = 700) =>
  `https://picsum.photos/id/${id}/${w}/${h}`;
const avatar = (seed: string) =>
  `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&size=56`;

const MOCK_CARDS: ReelCardData[] = [
  {
    id: "r1",
    variant: "video",
    username: "alcov.co",
    avatarUrl: avatar("alcov"),
    imageUrl: img(1015, 400, 700),
    likes: "9.9K",
    comments: "3.4K",
    saves: "1.2K",
    description:
      "I kept thinking about this. It\u2019s simple, but it explains a lot more than I expected. This isn\u2019t an easy concept, yet the way it was not a\u2026",
  },
  {
    id: "r2",
    variant: "image",
    username: "alcov.co",
    avatarUrl: avatar("alcov"),
    imageUrl: img(237, 400, 400),
    imageAspect: "1:1",
    likes: "1.2k",
    comments: "230",
    saves: "123",
    timestamp: "3 days ago",
  },
  {
    id: "r3",
    variant: "image",
    username: "alcov.co",
    avatarUrl: avatar("alcov"),
    imageUrl: img(292, 400, 530),
    imageAspect: "3:4",
    likes: "1.2k",
    comments: "230",
    saves: "123",
    description:
      "If you\u2019re starting from zero, this could still be worth it\u2014depending on how it\u2019s structured. A good beginner-friendly course should explain concepts clearly, avoid heavy jargon, and include step-by-step guidance with practical examples. What matters most is whether it builds fundamentals before moving into advanced topics. If you\u2019re curious, willing to practice, and patient with\u2026",
  },
  {
    id: "r4",
    variant: "discussion",
    username: "alcov.co",
    avatarUrl: avatar("alcov"),
    title: "AI is moving so fast it feels like junior SWE roles are doomed. But maybe they\u2019re not disappearing\u2014just evolving, with higher expectations and new skills required.",
    likes: "991",
    comments: "346",
    saves: "1.2k",
    timestamp: "3 days ago",
    description: "AI is advancing at a pace that makes it feel like non-senior SWE roles are basically doomed. When tools can generate features, refactor code\u2026",
  },
  {
    id: "r5",
    variant: "article",
    username: "alcov.co",
    avatarUrl: avatar("alcov"),
    title: "Why 90% of Short Videos Die in the First 2 Seconds",
    body: "I\u2019ve been through 3 rounds of layoffs (twice in HR, once when I was also laid off), and there\u2019s a pattern that emerges before the axe falls.\n\nI\u2019m not trying to create paranoia, but if you\u2019re seeing several of these signals at once, it might be a good moment to quietly update your resume. Layoffs rarely happen overnight; they\u2019re usually the result of months of decisions and signals.\n\nLooking back, the signs were often there: hiring freezes, sudden budget scrutiny, leadership becoming vague about roadmap priorities.\n\nIf multiple signals start appearing at the same time, it\u2019s usually not random. It\u2019s a signal that the company may already be preparing for changes behind the scenes.",
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
    imageUrl: img(188, 400, 700),
    likes: "12.9K",
    comments: "1.1K",
    saves: "3.2K",
    description: "Morning light in my apartment renovation \u2728 the before/after is insane",
  },
  {
    id: "r7",
    variant: "discussion",
    username: "realtalks",
    avatarUrl: avatar("realtalks"),
    title: "Anyone else feel like social media is just everyone performing happiness?",
    likes: "3.8K",
    comments: "892",
    saves: "1.5K",
    timestamp: "5 days ago",
  },
  {
    id: "r8",
    variant: "image",
    username: "tokyodrifter",
    avatarUrl: avatar("tokyo"),
    imageUrl: img(431, 400, 300),
    imageAspect: "4:3",
    likes: "4.2K",
    comments: "156",
    saves: "890",
    description:
      "Best coffee shops in Shibuya \u2014 a thread. Number 3 will blow your mind, it\u2019s hidden in a basement behind a vintage record store.",
  },
  {
    id: "r9",
    variant: "article",
    username: "nyc.reality",
    avatarUrl: avatar("nyc"),
    title: "The Real Cost of Living in NYC as a 25-Year-Old",
    body: "Everyone talks about the high rent but nobody mentions the $18 salads, $7 coffees, and the fact that you\u2019ll spend $150/month just on laundry. Here\u2019s my actual monthly breakdown after 2 years in Manhattan. Spoiler: it\u2019s more than you think, and the hidden costs are what really get you.",
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
      className="flex flex-col items-center px-[5%]"
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
