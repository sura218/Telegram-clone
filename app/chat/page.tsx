"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Spinner } from "@/components/ui/Spinner";
// CHANGED: use real stores and hooks instead of mock data
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import { usePresence } from "@/hooks/usePresence";
import { useChats } from "@/hooks/useChats";

export default function ChatPage() {
  const router = useRouter();
  // CHANGED: get real user from auth store
  const { user, isLoading, initFromStorage } = useAuthStore();
  // CHANGED: get real chats and activeChatId from chat store
  const { chats, activeChatId, setActiveChat } = useChatStore();
  const [showSidebar, setShowSidebar] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // CHANGED: init session from localStorage on mount
  useEffect(() => {
    initFromStorage();
  }, []);

  // CHANGED: redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading]);

  // Watch dark mode
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // CHANGED: real presence system — sets online/offline in Firestore
  usePresence(user?.id);

  // CHANGED: real-time chats subscription from Firestore
  useChats();

  // CHANGED: show spinner while loading session
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{ backgroundColor: isDark ? "#0F1C26" : "#ffffff" }}
    >
      {/* Sidebar */}
      <div className={`flex-shrink-0 w-full md:w-80 lg:w-96 ${showSidebar ? "flex" : "hidden"} md:flex flex-col`}>
        {/* CHANGED: Sidebar now gets real chats from store, not mock data */}
        <Sidebar
          onSelect={(id) => {
            setActiveChat(id);
            setShowSidebar(false);
          }}
          className="flex-1"
        />
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col min-w-0 ${!showSidebar ? "flex" : "hidden"} md:flex`}>
        {activeChatId ? (
          // CHANGED: ChatWindow now uses real chatId and Firestore messages
          <ChatWindow
            chatId={activeChatId}
            onBack={() => { setActiveChat(null); setShowSidebar(true); }}
            showBack={!showSidebar}
          />
        ) : (
          <div
            className="flex-1 flex flex-col items-center justify-center"
            style={{ backgroundColor: isDark ? "#0D1418" : "#E5DDD5" }}
          >
            <div className="w-24 h-24 rounded-full bg-tg-blue/10 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-tg-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 style={{ color: isDark ? "#ffffff" : "#374151" }} className="text-xl font-bold mb-2">
              Select a conversation
            </h2>
            <p className="text-sm text-gray-400 text-center max-w-xs">
              Choose a chat from the sidebar to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}