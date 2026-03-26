"use client";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/chat/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { MOCK_CHATS } from "@/data/mock";
import { Chat, Message } from "@/types";

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Watch dark mode and set CSS variables for bubbles
  useEffect(() => {
    const apply = () => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDark(dark);
      const root = document.documentElement;
      if (dark) {
        root.style.setProperty("--bubble-out", "#2B5278");
        root.style.setProperty("--bubble-in", "#182533");
        root.style.setProperty("--bubble-out-text", "#e2e8f0");
        root.style.setProperty("--bubble-in-text", "#e2e8f0");
      } else {
        root.style.setProperty("--bubble-out", "#DCF8C6");
        root.style.setProperty("--bubble-in", "#FFFFFF");
        root.style.setProperty("--bubble-out-text", "#1a202c");
        root.style.setProperty("--bubble-in-text", "#1a202c");
      }
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const activeChat = chats.find(c => c.id === activeChatId);

  const handleSelect = (id: string) => {
    setActiveChatId(id);
    setShowSidebar(false);
    setChats(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleSend = (chatId: string, text: string) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      senderName: "You",
      text,
      timestamp: new Date(),
      seen: false,
      deleted: false,
    };
    setChats(prev => prev.map(c =>
      c.id === chatId
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, lastMessageTime: new Date() }
        : c
    ));
  };

  return (
    <div className={cn("h-screen flex overflow-hidden", isDark ? "bg-tg-dark-bg" : "bg-white")}>
      {/* Sidebar */}
      <div className={`flex-shrink-0 w-full md:w-80 lg:w-96 ${showSidebar ? "flex" : "hidden"} md:flex flex-col`}>
        <Sidebar chats={chats} activeChatId={activeChatId} onSelect={handleSelect} className="flex-1" />
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col min-w-0 ${!showSidebar ? "flex" : "hidden"} md:flex`}>
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            onSend={handleSend}
            onBack={() => { setActiveChatId(null); setShowSidebar(true); }}
            showBack={!showSidebar}
          />
        ) : (
          <div className={`flex-1 flex flex-col items-center justify-center ${isDark ? "bg-tg-dark-chat-bg" : "bg-tg-chat-bg"}`}>
            <div className="w-24 h-24 rounded-full bg-tg-blue/10 flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-tg-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-700"}`}>
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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}