import { FeedTopNav } from "../components/FeedTopNav";
import { FeedCard, type FeedCardData } from "../components/FeedCard";

const img = (id: number, w = 400, h = 500) => `https://picsum.photos/id/${id}/${w}/${h}`;
const avatar = (seed: string) => `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&size=56`;

const MOCK_LEFT: FeedCardData[] = [
  {
    id: "l1",
    variant: "video",
    size: "portrait",
    title: "How I hid my ugly HVAC panel without blocking...",
    username: "adrianvvlog",
    likes: "1.6K",
    imageUrl: img(1015, 400, 530),
    avatarUrl: avatar("adrian"),
  },
  {
    id: "l2",
    variant: "image",
    size: "landscape",
    title: "My favourite food in GZ!",
    username: "tinsleyfok",
    likes: "3.9K",
    imageUrl: img(292, 400, 300),
    avatarUrl: avatar("tinsley"),
  },
  {
    id: "l3",
    variant: "discussion",
    size: "square",
    title: "Torn between options for funding HDB purchase",
    username: "C~A~T~A~R~I~N",
    likes: "110",
    avatarUrl: avatar("catarin"),
  },
  {
    id: "l4",
    variant: "article",
    title: "Which profession is going to get wiped out in the next 5-10 years?",
    username: "rockingao",
    likes: "2.9K",
    avatarUrl: avatar("rocking"),
    body: "I've been through 3 rounds of layoffs (twice in HR, once when I was also laid off), and there's a pattern that emerges before the axe falls. Not trying to create paranoia, but if you're seeing multiple signs on this list...",
  },
  {
    id: "l5",
    variant: "video",
    size: "portrait",
    title: "10 ways to decorate your living room in a modern way",
    username: "baoyue999",
    likes: "621",
    imageUrl: img(249, 400, 530),
    avatarUrl: avatar("baoyue"),
  },
  {
    id: "l6",
    variant: "image",
    size: "landscape",
    title: "Best coffee shops in Shibuya",
    username: "tokyodrifter",
    likes: "4.2K",
    imageUrl: img(431, 400, 300),
    avatarUrl: avatar("tokyo"),
  },
  {
    id: "l7",
    variant: "discussion",
    size: "portrait",
    title: "I worked remotely, got laid off, and when they asked what equipment I had to return, I only told them I had their laptop",
    username: "helloworld",
    likes: "2.3k",
    avatarUrl: avatar("hello"),
  },
  {
    id: "l8",
    variant: "video",
    size: "portrait",
    title: "My minimalist desk setup after 2 years of iteration",
    username: "cleandesk.co",
    likes: "8.1K",
    imageUrl: img(180, 400, 530),
    avatarUrl: avatar("cleandesk"),
  },
  {
    id: "l9",
    variant: "article",
    title: "Stop optimizing for productivity. Start optimizing for joy.",
    username: "mindful_dev",
    likes: "1.4K",
    avatarUrl: avatar("mindful"),
    body: "I spent 5 years perfecting my morning routine, tracking every habit, and optimizing my schedule down to 15-minute blocks. Then I burned out. Here's what I learned about the difference between being productive and being alive...",
  },
  {
    id: "l10",
    variant: "image",
    size: "landscape",
    title: "Found this gem of a bookstore in Lisbon",
    username: "wanderlust.anna",
    likes: "956",
    imageUrl: img(24, 400, 300),
    avatarUrl: avatar("anna"),
  },
  {
    id: "l11",
    variant: "video",
    size: "portrait",
    title: "DIY floating shelves that actually hold weight",
    username: "makerstudio",
    likes: "3.3K",
    imageUrl: img(342, 400, 530),
    avatarUrl: avatar("maker"),
  },
  {
    id: "l12",
    variant: "discussion",
    size: "square",
    title: "What's one thing you wish someone told you before your first job?",
    username: "career.mentor",
    likes: "5.1K",
    avatarUrl: avatar("career"),
  },
];

const MOCK_RIGHT: FeedCardData[] = [
  {
    id: "r1",
    variant: "image",
    size: "landscape",
    title: 'I finally fixed the UGLY "boob light" in my rental!',
    username: "alcov.co",
    likes: "2",
    imageUrl: img(237, 400, 300),
    avatarUrl: avatar("alcov"),
  },
  {
    id: "r2",
    variant: "article",
    title: "Why 90% of Short Videos Die in the First 2 Seconds: How Weak Hooks Kill Your Content",
    username: "Significant_Soup2558",
    likes: "212",
    avatarUrl: avatar("soup"),
    body: "I've analyzed over 500 viral short-form videos and the pattern is crystal clear. The first 2 seconds determine everything. Here's my framework for hooks that actually work, broken down by content type...",
  },
  {
    id: "r3",
    variant: "video",
    size: "portrait",
    title: "Morning light in my apartment renovation",
    username: "baoyue999",
    likes: "12.9K",
    imageUrl: img(188, 400, 530),
    avatarUrl: avatar("baoyue"),
  },
  {
    id: "r4",
    variant: "image",
    size: "square",
    title: "My babe Fanin",
    username: "C~A~T~A~R~I~N",
    likes: "110",
    imageUrl: img(169, 400, 400),
    avatarUrl: avatar("catarin"),
  },
  {
    id: "r5",
    variant: "discussion",
    size: "portrait",
    title: "Anyone else feel like social media is just everyone performing happiness?",
    username: "realtalks",
    likes: "3.8K",
    avatarUrl: avatar("realtalks"),
  },
  {
    id: "r6",
    variant: "video",
    size: "portrait",
    title: "Street food tour in Bangkok's hidden alleys",
    username: "foodie.explorer",
    likes: "5.7K",
    imageUrl: img(225, 400, 530),
    avatarUrl: avatar("foodie"),
  },
  {
    id: "r7",
    variant: "image",
    size: "landscape",
    title: "My plant collection after 3 years",
    username: "greenthumb.daily",
    likes: "2.1K",
    imageUrl: img(152, 400, 300),
    avatarUrl: avatar("green"),
  },
  {
    id: "r8",
    variant: "article",
    title: "The real cost of living in NYC as a 25-year-old",
    username: "nyc.reality",
    likes: "6.8K",
    avatarUrl: avatar("nyc"),
    body: "Everyone talks about the high rent but nobody mentions the $18 salads, $7 coffees, and the fact that you'll spend $150/month just on laundry. Here's my actual monthly breakdown after 2 years in Manhattan...",
  },
  {
    id: "r9",
    variant: "video",
    size: "landscape",
    title: "Painted my kitchen cabinets and I'm obsessed",
    username: "diy.sarah",
    likes: "4.5K",
    imageUrl: img(200, 400, 300),
    avatarUrl: avatar("sarah"),
  },
  {
    id: "r10",
    variant: "discussion",
    size: "square",
    title: "Is it worth going back to school at 30?",
    username: "latelearner",
    likes: "2.4K",
    avatarUrl: avatar("late"),
  },
  {
    id: "r11",
    variant: "image",
    size: "portrait",
    title: "Vintage camera collection growing nicely",
    username: "analog.dreams",
    likes: "789",
    imageUrl: img(250, 400, 530),
    avatarUrl: avatar("analog"),
  },
  {
    id: "r12",
    variant: "video",
    size: "portrait",
    title: "Cozy reading nook transformation",
    username: "longtimenosea",
    likes: "621",
    imageUrl: img(336, 400, 530),
    avatarUrl: avatar("longtime"),
  },
];

export function FeedPage() {
  return (
    <div>
      <FeedTopNav />
      <div className="grid grid-cols-2 gap-3 px-2 pb-4 pt-12">
        <div className="flex flex-col gap-3 min-w-0">
          {MOCK_LEFT.map((card) => (
            <FeedCard key={card.id} card={card} />
          ))}
        </div>
        <div className="flex flex-col gap-3 min-w-0">
          {MOCK_RIGHT.map((card) => (
            <FeedCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
