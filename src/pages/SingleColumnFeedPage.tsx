import { PostCard, type PostCardData } from "../components/PostCard";

const MOCK_POSTS: PostCardData[] = [
  {
    id: "sc1",
    username: "alcov.co",
    title: "I kept thinking about this after the video ended.",
    timestamp: "4 days ago",
    imageBg: "#3a3a3a",
    aspect: "square",
    likes: "1.2k",
    comments: "230",
    saves: "123",
  },
  {
    id: "sc2",
    username: "alcov.co",
    title: "Is This Course Worth It for Absolute Beginners?",
    timestamp: "3 days ago",
    imageBg: "#8B5E2a",
    aspect: "square",
    likes: "1.2k",
    comments: "230",
    saves: "123",
    carousel: "2/3",
  },
  {
    id: "sc3",
    username: "tinsleyfok",
    title: "My favourite food in GZ!",
    timestamp: "1 week ago",
    imageBg: "#1a3a2a",
    aspect: "portrait",
    likes: "3.9K",
    comments: "85",
    saves: "201",
  },
  {
    id: "sc4",
    username: "adrianvvlog",
    title: "How I hid my ugly HVAC panel without blocking air flow",
    timestamp: "2 days ago",
    imageBg: "#8B4513",
    aspect: "portrait",
    likes: "1.6K",
    comments: "142",
    saves: "89",
    carousel: "1/5",
  },
];

export function SingleColumnFeedPage() {
  return (
    <div className="pt-2 pb-4">
      {MOCK_POSTS.map((post) => (
        <PostCard key={post.id} data={post} />
      ))}
    </div>
  );
}
