"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@/components/ui/Avatar";
// CHANGED: now takes real User object instead of Chat object
import { User } from "@/types";

interface Props {
  // CHANGED: otherUser is now a real User from Firestore
  otherUser?: User;
  onBack?: () => void;
  showBack?: boolean;
  isDark?: boolean;
}

export function ChatHeader({ otherUser, onBack, showBack, isDark }: Props) {
  const name = otherUser?.displayName || "Chat";
  // CHANGED: use real online status from Firestore
  const isOnline = otherUser?.online ?? false;

  return (
    <div
      className="flex items-center gap-3 px-4 h-16 border-b flex-shrink-0"
      style={{
        backgroundColor: isDark ? "#17212B" : "#ffffff",
        borderColor: isDark ? "#2a3a4a" : "#e5e7eb",
      }}
    >
      {showBack && (
        <button onClick={onBack} className="p-1.5 rounded-lg transition md:hidden"
          style={{ color: isDark ? "#9ca3af" : "#6b7280" }}>
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
      )}
      {/* CHANGED: show real online dot */}
      <Avatar name={name} size="sm" online={isOnline} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm" style={{ color: isDark ? "#ffffff" : "#111827" }}>
          {name}
        </p>
        {/* CHANGED: real online/offline status */}
        <p className="text-xs" style={{ color: isOnline ? "#2AABEE" : "#9ca3af" }}>
          {isOnline ? "online" : "offline"}
        </p>
      </div>
    </div>
  );
}