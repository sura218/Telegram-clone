"use client";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@/components/ui/Avatar";
import { Chat } from "@/types";

interface Props {
  chat: Chat;
  onBack?: () => void;
  showBack?: boolean;
}

export function ChatHeader({ chat, onBack, showBack }: Props) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="flex items-center gap-3 px-4 h-16 border-b flex-shrink-0"
      style={{
        backgroundColor: isDark ? "#17212B" : "#ffffff",
        borderColor: isDark ? "#2a3a4a" : "#e5e7eb",
      }}
    >
      {showBack && (
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg transition md:hidden"
          style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
      )}
      <Avatar name={chat.participantName} size="sm" online={chat.participantOnline} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm" style={{ color: isDark ? "#ffffff" : "#111827" }}>
          {chat.participantName}
        </p>
        <p className="text-xs" style={{ color: chat.participantOnline ? "#2AABEE" : "#9ca3af" }}>
          {chat.participantOnline ? "online" : "offline"}
        </p>
      </div>
    </div>
  );
}