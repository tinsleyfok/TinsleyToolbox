import { useTheme } from "../hooks/useTheme";
import { MessageItem, type MessageData } from "../components/MessageItem";

const ACTIVITIES = [
  {
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 4.71796C13.6037 2.70615 15.8052 1.93841 18.0009 2.38336C19.156 2.61744 20.7948 3.52702 21.8771 5.12311C23.0033 6.78375 23.4825 9.11938 22.3628 12.0489C21.4891 14.3345 19.6161 16.4637 17.7252 18.1501C15.8195 19.8496 13.7893 21.1927 12.4634 21.8861L12 22.1285L11.5366 21.8861C10.2107 21.1927 8.18053 19.8496 6.27485 18.1501C4.3839 16.4637 2.51088 14.3345 1.63724 12.0489C0.517543 9.11938 0.996754 6.78375 2.12289 5.12311C3.20524 3.52702 4.84404 2.61744 5.99914 2.38336C8.19482 1.93841 10.3963 2.70615 12 4.71796Z" fill={color} />
      </svg>
    ),
  },
  {
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M1 10.7501C1 5.6415 5.93988 1.75012 12 1.75012C18.0601 1.75012 23 5.6415 23 10.7501C23 13.565 21.4063 16.1214 19.3377 18.1504C17.2587 20.1896 14.6077 21.7907 12.2718 22.6991C12.0411 22.7889 11.7809 22.7589 11.5765 22.6191C11.3722 22.4794 11.25 22.2477 11.25 22.0001V19.4813C5.5655 19.1952 1 15.6701 1 10.7501ZM7 12.5001C7.82843 12.5001 8.5 11.8285 8.5 11.0001C8.5 10.1717 7.82843 9.50012 7 9.50012C6.17157 9.50012 5.5 10.1717 5.5 11.0001C5.5 11.8285 6.17157 12.5001 7 12.5001ZM12 12.5001C12.8284 12.5001 13.5 11.8285 13.5 11.0001C13.5 10.1717 12.8284 9.50012 12 9.50012C11.1716 9.50012 10.5 10.1717 10.5 11.0001C10.5 11.8285 11.1716 12.5001 12 12.5001ZM18.5 11.0001C18.5 11.8285 17.8284 12.5001 17 12.5001C16.1716 12.5001 15.5 11.8285 15.5 11.0001C15.5 10.1717 16.1716 9.50012 17 9.50012C17.8284 9.50012 18.5 10.1717 18.5 11.0001Z" fill={color} />
      </svg>
    ),
  },
  {
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M7.99994 12C5.51466 12 3.49994 9.98528 3.49994 7.5C3.49994 5.01472 5.51466 3 7.99994 3C10.4852 3 12.4999 5.01472 12.4999 7.5C12.4999 9.98528 10.4852 12 7.99994 12Z" fill={color} />
        <path d="M18.4999 12.25C16.4289 12.25 14.7499 10.5711 14.7499 8.5C14.7499 6.42893 16.4289 4.75 18.4999 4.75C20.571 4.75 22.2499 6.42893 22.2499 8.5C22.2499 10.5711 20.571 12.25 18.4999 12.25Z" fill={color} />
        <path d="M8.68509 13.875C9.4403 13.8749 9.90381 13.8749 10.303 13.9453C12.2178 14.2829 13.717 15.7821 14.0546 17.6969C14.125 18.096 14.1249 18.5596 14.1249 19.3148L14.1248 19.3889L14.1249 19.4117C14.1251 19.488 14.1254 19.5953 14.1078 19.6953C14.0256 20.1611 13.661 20.5258 13.1952 20.6079C13.0951 20.6256 12.9878 20.6253 12.9115 20.625L12.8887 20.625H2.61096L2.58819 20.625C2.51189 20.6253 2.40458 20.6256 2.30449 20.6079C1.83873 20.5258 1.47407 20.1611 1.39194 19.6953C1.37429 19.5953 1.37459 19.488 1.37481 19.4117L1.37485 19.3889L1.37485 19.3148C1.37477 18.5596 1.37473 18.096 1.44511 17.6969C1.78275 15.7821 3.28192 14.2829 5.19673 13.9453C5.59589 13.8749 6.0594 13.8749 6.81461 13.875H8.68509Z" fill={color} />
        <path d="M16.2471 14.507C15.8858 14.6038 15.5459 14.7507 15.2351 14.9399C15.6801 15.6563 15.9949 16.463 16.1474 17.3279C16.2516 17.9188 16.2508 18.5687 16.2501 19.2218L16.2499 19.3889L16.2499 19.399C16.25 19.4389 16.25 19.5184 16.2477 19.5941C16.2449 19.6862 16.237 19.8575 16.2006 20.0644C16.1665 20.2578 16.1155 20.4452 16.0492 20.625H22.3333L22.3674 20.6251C22.4818 20.6256 22.6434 20.6262 22.7911 20.5867C23.1794 20.4826 23.4826 20.1794 23.5866 19.7912C23.6262 19.6434 23.6256 19.4818 23.6251 19.3674L23.625 19.3333L23.625 19.2282C23.6252 18.3217 23.6253 17.741 23.4929 17.2471C23.1346 15.9098 22.0901 14.8653 20.7529 14.507C20.2589 14.3747 19.6783 14.3748 18.7718 14.375H18.2282C17.3217 14.3748 16.741 14.3747 16.2471 14.507Z" fill={color} />
      </svg>
    ),
  },
];

const MOCK_MESSAGES: MessageData[] = [
  { id: "m1", username: "baoyue999", message: "😋", time: "Just now", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=baoyue&size=56" },
  { id: "m2", username: "longtimenosea", message: "Now I'm super addicted to golf", time: "2h", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=longtime&size=56" },
  { id: "m3", username: "smartyquang", message: "[Image]", time: "1w", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=smarty&size=56" },
  { id: "m4", username: "rockingao", message: ";)", time: "1w", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=rocking&size=56" },
  { id: "m5", username: "Junwei", message: "Sure!", time: "1w", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=junwei&size=56" },
  { id: "m6", username: "Junwei", message: "I cannot bewlieve this is what you want to say.", time: "1w", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=junwei2&size=56" },
  { id: "m7", username: "helloworld", message: "[Image]", time: "3 hrs ago", avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=hello&size=56" },
];

export function InboxPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div>
      {/* Fixed header - always visible */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center h-12 px-4"
        style={{ background: isDark ? "#0f0f0f" : "#ffffff" }}
      >
        <span
          className="font-rethink text-[18px] font-bold leading-[25px]"
          style={{ color: isDark ? "#ffffff" : "#000000" }}
        >
          Inbox
        </span>
      </div>

      {/* Content */}
      <div className="pt-12">
        {/* Activities */}
        <div className="px-4 flex gap-4 py-4">
          {ACTIVITIES.map((a, i) => (
            <button
              key={i}
              className="w-20 h-20 rounded-full flex items-center justify-center border-none cursor-pointer"
              style={{
                background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
              }}
            >
              {a.icon(isDark ? "#fff" : "#000")}
            </button>
          ))}
        </div>

        {/* Message heading */}
        <div className="px-5 pt-2 pb-2">
          <span
            className="font-rethink text-[20px] font-bold leading-[28px]"
            style={{ color: isDark ? "#ffffff" : "#000000" }}
          >
            Message
          </span>
        </div>

        {/* Message list */}
        <div>
          {MOCK_MESSAGES.map((msg) => (
            <MessageItem key={msg.id} data={msg} />
          ))}
        </div>
      </div>
    </div>
  );
}
