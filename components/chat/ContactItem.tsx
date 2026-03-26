import { Avatar } from "@/components/ui/Avatar";
import Badge  from "@/components/ui/Badge";
import { formatChatTime } from "@/utils/format";
import { Chat } from "@/types";

interface Props {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  isDark?: boolean;
}

export function ContactItem({ chat, isActive, onClick, isDark }: Props) {
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
      <Avatar name={chat.participantName} size="md" online={chat.participantOnline} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className="font-medium text-sm truncate"
            style={{ color: isActive ? "#2AABEE" : isDark ? "#ffffff" : "#111827" }}
          >
            {chat.participantName}
          </span>
          <span className="text-xs flex-shrink-0" style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>
            {formatChatTime(chat.lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs truncate flex-1" style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>
            {chat.lastMessage}
          </p>
          <Badge count={chat.unread} />
        </div>
      </div>
    </button>
  );
}