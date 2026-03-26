"use client";
import { useRef, useEffect, useState } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "./MessageInpute";
import { Chat } from "@/types";

interface Props {
  chat: Chat;
  onSend: (chatId: string, text: string) => void;
  onBack?: () => void;
  showBack?: boolean;
}

export function ChatWindow({ chat, onSend, onBack, showBack }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages.length]);

  const bgImage = isDark ? "/chat-bg-dark.jpg" : "/chat-bg-white.jpg";

  return (
    <div className="flex flex-col h-full">
      <ChatHeader chat={chat} onBack={onBack} showBack={showBack} />

      {/* Wrapper with background image */}
      <div
        className="flex-1 overflow-y-auto relative"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay so image is always visible */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark
              ? "rgba(0,0,0,0.15)"
              : "rgba(0,0,0,0.15)",
          }}
        />

        {/* Messages on top of overlay */}
        <div className="relative z-10 px-4 py-4 scrollbar-thin min-h-full">
          {chat.messages.length === 0 && (
            <div className="flex items-center justify-center h-full py-20">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-6 py-3 text-white text-sm">
                Send a message to start chatting!
              </div>
            </div>
          )}
          <div className="space-y-0.5">
            {chat.messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === "me"} />
            ))}
          </div>
          <div ref={endRef} />
        </div>
      </div>

      <MessageInput onSend={(text) => onSend(chat.id, text)} />
    </div>
  );
}
