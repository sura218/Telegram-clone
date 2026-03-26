import { Avatar } from "@/components/ui/Avatar";
import { formatChatTime } from "@/utils/format";
// CHANGED: now accepts real Chat type with participants and unreadCount map
import { Chat, User } from "@/types";

interface Props {
  chat: Chat;
  // CHANGED: added otherUser and currentUserId for real data
  otherUser?: User;
  currentUserId: string;
  isActive: boolean;
  onClick: () => void;
  isDark?: boolean;
}

export function ContactItem({ chat, otherUser, currentUserId, isActive, onClick, isDark }: Props) {
  // CHANGED: get unread count from real unreadCount map using currentUserId
  const unread = chat.unreadCount?.[currentUserId] || 0;
  // CHANGED: get name from real user object
  const name = otherUser?.displayName || "Unknown";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left"
      style={{
        backgroundColor: isActive
          ? isDark ? "rgba(42,171,238,0.2)" : "rgba(42,171,238,0.1)"
          : "transparent",
      }}
      onMouseEnter={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
      }}
      onMouseLeave={e => {
        if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
      }}
    >
      {/* CHANGED: use real online status from otherUser */}
      <Avatar name={name} size="md" online={otherUser?.online} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm truncate" style={{ color: isActive ? "#2AABEE" : isDark ? "#ffffff" : "#111827" }}>
            {name}
          </span>
          {/* CHANGED: use real lastMessageTime */}
          <span className="text-xs flex-shrink-0" style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>
            {chat.lastMessageTime ? formatChatTime(chat.lastMessageTime) : ""}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          {/* CHANGED: use real lastMessage */}
          <p className="text-xs truncate flex-1" style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>
            {chat.lastMessage || "Start chatting"}
          </p>
          {/* CHANGED: real unread badge count */}
          {unread > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold bg-tg-blue text-white">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}