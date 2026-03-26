"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon, SunIcon, MoonIcon,
  ArrowRightOnRectangleIcon, PencilSquareIcon, XMarkIcon
} from "@heroicons/react/24/outline";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { ContactItem } from "@/components/chat/ContactItem";
// CHANGED: import real stores and services
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import { signOut, searchUsers, subscribeToUser, getUserById } from "@/services/auth.service";
import { getOrCreatePrivateChat } from "@/services/chat.service";
import { User } from "@/types";
import { cn } from "@/utils/cn";

interface Props {
  onSelect: (id: string) => void;
  className?: string;
}

export function Sidebar({ onSelect, className }: Props) {
  const router = useRouter();
  // CHANGED: get real user from auth store
  const { user, setUser } = useAuthStore();
  // CHANGED: get real chats and cache from chat store
  const { chats, activeChatId, setActiveChat, usersCache, cacheUser } = useChatStore();

  const [search, setSearch] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // CHANGED: preload other user's data for each chat

// CHANGED: track active subscriptions to avoid duplicate listeners
// and prevent stale data from overwriting fresh data
useEffect(() => {
  if (!user) return;
  const unsubs: (() => void)[] = [];
  const subscribed = new Set<string>();

  chats.forEach(chat => {
    const oid = chat.participants.find(p => p !== user.id);
    // CHANGED: only subscribe once per user, not on every render
    if (oid && !subscribed.has(oid)) {
      subscribed.add(oid);
      const unsub = subscribeToUser(oid, (u) => {
        cacheUser(u);
      });
      unsubs.push(unsub);
    }
  });

  return () => unsubs.forEach(u => u());
}, [chats.map(c => c.id).join(","), user?.id]);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(prev => !prev);
  };

  // CHANGED: filter real chats using usersCache
  const filtered = chats.filter(chat => {
    const otherId = chat.participants.find(p => p !== user?.id);
    const other = otherId ? usersCache[otherId] : undefined;
    const lower = search.toLowerCase();
    return (
      !search.trim() ||
      other?.displayName.toLowerCase().includes(lower) ||
      other?.email.toLowerCase().includes(lower) ||
      chat.lastMessage?.toLowerCase().includes(lower)
    );
  });

  // CHANGED: search real users in Firestore
  const handleUserSearch = async (val: string) => {
    setUserSearch(val);
    if (!val.trim() || !user) { setUserResults([]); return; }
    setSearching(true);
    try { setUserResults(await searchUsers(val, user.id)); }
    finally { setSearching(false); }
  };

  // CHANGED: create real chat in Firestore
  const startChat = async (target: User) => {
    if (!user || creating) return;
    setCreating(true);
    try {
      const chat = await getOrCreatePrivateChat(user.id, user.email, target.id, target.email);
      cacheUser(target);
      setActiveChat(chat.id);
      onSelect(chat.id);
      setNewChatOpen(false);
      setUserSearch("");
      setUserResults([]);
    } finally { setCreating(false); }
  };

  // CHANGED: real sign out — sets offline in Firestore and clears session
  const handleSignOut = async () => {
    if (!user) return;
    await signOut(user.id);
    setUser(null);
    router.push("/login");
  };

  return (
    <div
      className={cn("flex flex-col h-full border-r", className)}
      style={{ backgroundColor: isDark ? "#17212B" : "#ffffff", borderColor: isDark ? "#2a3a4a" : "#e5e7eb" }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex-shrink-0 border-b" style={{ borderColor: isDark ? "#2a3a4a" : "#e5e7eb" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {/* CHANGED: show real user's name and avatar */}
            <Avatar name={user?.displayName || "?"} size="sm" online />
            <div>
              <p className="font-semibold text-sm" style={{ color: isDark ? "#ffffff" : "#111827" }}>
                {user?.displayName}
              </p>
              <p className="text-xs text-tg-blue">online</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={toggleDark} className="p-2 rounded-xl transition">
              {isDark
                ? <SunIcon className="w-5 h-5 text-yellow-400" />
                : <MoonIcon className="w-5 h-5 text-gray-500" />}
            </button>
            {/* CHANGED: new chat button to search and start real chats */}
            <button
              onClick={() => setNewChatOpen(true)}
              className="p-2 rounded-xl transition"
              style={{ color: "#2AABEE" }}
            >
              <PencilSquareIcon className="w-5 h-5" />
            </button>
            {/* CHANGED: real sign out button */}
            <button onClick={handleSignOut} className="p-2 rounded-xl transition text-red-400 hover:text-red-500">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: isDark ? "#6b7280" : "#9ca3af" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none"
            style={{ backgroundColor: isDark ? "#242f3d" : "#f3f4f6", color: isDark ? "#ffffff" : "#111827" }}
          />
        </div>
      </div>

      {/* CHANGED: render real chats from Firestore */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-0.5">
        {filtered.length === 0 && (
          <p className="text-center text-sm py-8" style={{ color: isDark ? "#6b7280" : "#9ca3af" }}>
            {search ? "No chats found" : "No chats yet — start one!"}
          </p>
        )}
        {filtered.map(chat => {
          const otherId = chat.participants.find(p => p !== user?.id);
          const otherUser = otherId ? usersCache[otherId] : undefined;
          return (
            <ContactItem
              key={chat.id}
              chat={chat}
              // CHANGED: pass real other user data and unread count
              otherUser={otherUser}
              currentUserId={user?.id || ""}
              isActive={chat.id === activeChatId}
              isDark={isDark}
              onClick={() => { setActiveChat(chat.id); onSelect(chat.id); }}
            />
          );
        })}
      </div>

      {/* CHANGED: new chat modal to search real users */}
      {newChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ backgroundColor: isDark ? "#17212B" : "#ffffff" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: isDark ? "#ffffff" : "#111827" }}>New Message</h2>
              <button onClick={() => { setNewChatOpen(false); setUserSearch(""); setUserResults([]); }}>
                <XMarkIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={userSearch}
                onChange={e => handleUserSearch(e.target.value)}
                placeholder="Search by name or email..."
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none border"
                style={{
                  backgroundColor: isDark ? "#242f3d" : "#f3f4f6",
                  color: isDark ? "#ffffff" : "#111827",
                  borderColor: isDark ? "#2a3a4a" : "#e5e7eb",
                }}
              />
            </div>
            <div className="mt-3 max-h-64 overflow-y-auto space-y-1">
              {searching && <div className="flex justify-center py-4"><Spinner /></div>}
              {!searching && userSearch && !userResults.length && (
                <p className="text-center text-sm text-gray-400 py-4">No users found</p>
              )}
              {userResults.map(u => (
                <button
                  key={u.id}
                  onClick={() => startChat(u)}
                  disabled={creating}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition text-left"
                  style={{ backgroundColor: "transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <Avatar name={u.displayName} size="sm" online={u.online} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: isDark ? "#ffffff" : "#111827" }}>{u.displayName}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </button>
              ))}
              {!userSearch && (
                <p className="text-center text-xs text-gray-400 py-4">Type a name or email to search</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}