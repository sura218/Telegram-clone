"use client";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { Avatar } from "@/components/ui/Avatar";
import { ContactItem } from "@/components/chat/ContactItem";
import { Chat } from "@/types";
import { cn } from "@/utils/cn";

interface Props {
  chats: Chat[];
  activeChatId: string | null;
  onSelect: (id: string) => void;
  className?: string;
}

export function Sidebar({ chats, activeChatId, onSelect, className }: Props) {
  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(prev => !prev);
  };

  const filtered = chats.filter(c =>
    c.participantName.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={cn("flex flex-col h-full border-r", className)}
      style={{ backgroundColor: isDark ? "#17212B" : "#ffffff", borderColor: isDark ? "#2a3a4a" : "#e5e7eb" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex-shrink-0 border-b"
        style={{ borderColor: isDark ? "#2a3a4a" : "#e5e7eb" }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <Avatar name="You" size="sm" online />
            <div>
              <p className="font-semibold text-sm" style={{ color: isDark ? "#ffffff" : "#111827" }}>You</p>
              <p className="text-xs text-tg-blue">online</p>
            </div>
          </div>
          <button
            onClick={toggleDark}
            className="p-2 rounded-xl transition"
            style={{ color: isDark ? "#9ca3af" : "#6b7280" }}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark
              ? <SunIcon className="w-5 h-5 text-yellow-400" />
              : <MoonIcon className="w-5 h-5" />
            }
          </button>
        </div>

        <div className="relative">
          <MagnifyingGlassIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: isDark ? "#6b7280" : "#9ca3af" }}
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none"
            style={{
              backgroundColor: isDark ? "#242f3d" : "#f3f4f6",
              color: isDark ? "#ffffff" : "#111827",
            }}
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5">
        {filtered.map(chat => (
          <ContactItem
            key={chat.id}
            chat={chat}
            isActive={chat.id === activeChatId}
            onClick={() => onSelect(chat.id)}
            isDark={isDark}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm py-8" style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>
            No chats found
          </p>
        )}
      </div>
    </div>
  );
}