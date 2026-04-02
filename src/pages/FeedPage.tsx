import { FeedTopNav } from "../components/FeedTopNav";
import { FeedCard, type FeedCardData } from "../components/FeedCard";
import { holoAvatar } from "../utils/holoAvatar";
import { publicUrl, tinsleyProfilePhoto } from "../utils/publicAsset";

const feedImg = (file: string) => publicUrl(`images/${file}`);
const avatar = (seed: string) => holoAvatar(seed);

const MOCK_LEFT: FeedCardData[] = [
  // ── Custom images up top ──
  {
    id: "l1",
    variant: "image",
    size: "portrait",
    title: "Golden hour clouds are unreal today",
    username: "skygazer",
    likes: "6.2K",
    imageUrl: feedImg("feed-clouds.png"),
    avatarUrl: avatar("skygazer"),
  },
  {
    id: "l2",
    variant: "image",
    size: "landscape",
    title: "The whole squad showed up today",
    username: "pineviewpuppies",
    likes: "15.6K",
    imageUrl: feedImg("feed-puppies-row.png"),
    avatarUrl: avatar("pineview"),
  },
  // ── Mixed content ──
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
    variant: "video",
    size: "portrait",
    title: "How I hid my ugly HVAC panel without blocking...",
    username: "adrianvvlog",
    likes: "1.6K",
    imageUrl: feedImg("feed-hvac.jpg"),
    avatarUrl: avatar("adrian"),
  },
  {
    id: "l5",
    variant: "image",
    size: "portrait",
    title: "Kimono girl reporting for duty",
    username: "chihuahua.queen",
    likes: "8.3K",
    imageUrl: feedImg("feed-chihuahua.png"),
    avatarUrl: avatar("chihuahua"),
  },
  {
    id: "l6",
    variant: "image",
    size: "landscape",
    title: "Best coffee shops in Shibuya",
    username: "tokyodrifter",
    likes: "4.2K",
    imageUrl: feedImg("feed-food.jpg"),
    avatarUrl: avatar("tokyo"),
  },
  {
    id: "l7",
    variant: "video",
    size: "portrait",
    title: "Sunrise hike was worth the early alarm",
    username: "trailvibes",
    likes: "8.1K",
    imageUrl: feedImg("feed-decor1.jpg"),
    avatarUrl: avatar("trailvibes"),
  },
  {
    id: "l8",
    variant: "article",
    title: "Stop optimizing for productivity. Start optimizing for joy.",
    username: "mindful_dev",
    likes: "1.4K",
    avatarUrl: avatar("mindful"),
    body: "I spent 5 years perfecting my morning routine, tracking every habit, and optimizing my schedule down to 15-minute blocks. Then I burned out. Here's what I learned about the difference between being productive and being alive...",
  },
  {
    id: "l9",
    variant: "image",
    size: "landscape",
    title: "My favourite food in GZ!",
    username: "tinsleyfok",
    likes: "3.9K",
    imageUrl: feedImg("feed-food.jpg"),
    avatarUrl: tinsleyProfilePhoto,
  },
  {
    id: "l10",
    variant: "video",
    size: "portrait",
    title: "DIY floating shelves that actually hold weight",
    username: "makerstudio",
    likes: "3.3K",
    imageUrl: feedImg("feed-interior.jpg"),
    avatarUrl: avatar("maker"),
  },
  {
    id: "l11",
    variant: "discussion",
    size: "square",
    title: "What's one thing you wish someone told you before your first job?",
    username: "career.mentor",
    likes: "5.1K",
    avatarUrl: avatar("career"),
  },
  {
    id: "l12",
    variant: "video",
    size: "portrait",
    title: "Cozy reading nook transformation",
    username: "longtimenosea",
    likes: "621",
    imageUrl: feedImg("living-room.png"),
    avatarUrl: avatar("longtime"),
  },
];

const MOCK_RIGHT: FeedCardData[] = [
  // ── Custom images first ──
  {
    id: "r1",
    variant: "image",
    size: "square",
    title: "Valentine's day with my two besties",
    username: "pineviewpuppies",
    likes: "12.1K",
    imageUrl: feedImg("feed-puppies-two.png"),
    avatarUrl: avatar("pineview"),
  },
  {
    id: "r2",
    variant: "image",
    size: "portrait",
    title: "Made a bead curtain for my room and it's so dreamy",
    username: "sparkle.craft",
    likes: "4.7K",
    imageUrl: feedImg("feed-beads.png"),
    avatarUrl: avatar("sparkle"),
  },
  // ── Mixed content ──
  {
    id: "r3",
    variant: "video",
    size: "portrait",
    title: "Morning light in my apartment renovation",
    username: "baoyue999",
    likes: "12.9K",
    imageUrl: feedImg("living-room.png"),
    avatarUrl: avatar("baoyue"),
  },
  {
    id: "r4",
    variant: "article",
    title: "Why 90% of Short Videos Die in the First 2 Seconds",
    username: "Significant_Soup2558",
    likes: "212",
    avatarUrl: avatar("soup"),
    body: "I've analyzed over 500 viral short-form videos and the pattern is crystal clear. The first 2 seconds determine everything. Here's my framework for hooks that actually work, broken down by content type...",
  },
  {
    id: "r5",
    variant: "image",
    size: "landscape",
    title: "Weekend escape to the countryside",
    username: "wanderlust.anna",
    likes: "1.8K",
    imageUrl: feedImg("feed-living.jpg"),
    avatarUrl: avatar("anna"),
  },
  {
    id: "r6",
    variant: "video",
    size: "portrait",
    title: "Street food tour in Bangkok's hidden alleys",
    username: "foodie.explorer",
    likes: "5.7K",
    imageUrl: feedImg("feed-food.jpg"),
    avatarUrl: avatar("foodie"),
  },
  {
    id: "r7",
    variant: "discussion",
    size: "portrait",
    title: "Anyone else feel like social media is just everyone performing happiness?",
    username: "realtalks",
    likes: "3.8K",
    avatarUrl: avatar("realtalks"),
  },
  {
    id: "r8",
    variant: "image",
    size: "landscape",
    title: "Sunday morning coffee with a view",
    username: "slowmornings",
    likes: "4.5K",
    imageUrl: feedImg("feed-decor2.jpg"),
    avatarUrl: avatar("slowmornings"),
  },
  {
    id: "r9",
    variant: "image",
    size: "portrait",
    title: "Found this gem of a bookstore in Lisbon",
    username: "wanderlust.anna",
    likes: "956",
    imageUrl: feedImg("feed-cat.jpg"),
    avatarUrl: avatar("anna"),
  },
  {
    id: "r10",
    variant: "article",
    title: "The real cost of living in NYC as a 25-year-old",
    username: "nyc.reality",
    likes: "6.8K",
    avatarUrl: avatar("nyc"),
    body: "Everyone talks about the high rent but nobody mentions the $18 salads, $7 coffees, and the fact that you'll spend $150/month just on laundry. Here's my actual monthly breakdown after 2 years in Manhattan...",
  },
  {
    id: "r11",
    variant: "video",
    size: "portrait",
    title: "My vintage camera collection growing nicely",
    username: "analog.dreams",
    likes: "789",
    imageUrl: feedImg("feed-booblight.jpg"),
    avatarUrl: avatar("analog"),
  },
  {
    id: "r12",
    variant: "image",
    size: "landscape",
    title: "My plant collection after 3 years",
    username: "greenthumb.daily",
    likes: "2.1K",
    imageUrl: feedImg("feed-decor1.jpg"),
    avatarUrl: avatar("green"),
  },
];

export function FeedPage() {
  return (
    <div>
      <FeedTopNav />
      <div className="grid grid-cols-2 gap-3 px-2 pb-4 pt-1">
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
