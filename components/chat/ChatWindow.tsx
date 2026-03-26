"use client";
import { useRef, useEffect, useState } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "./MessageInput";
import { Spinner } from "@/components/ui/Spinner";
import { subscribeToUser } from "@/services/auth.service";
// CHANGED: use real stores, hooks and services
import { useAuthStore } from "@/store/auth.store";
import { useChatStore } from "@/store/chat.store";
import { useMessages } from "@/hooks/useMessages";
import { sendMessage, deleteMessage } from "@/services/chat.service";
import { getUserById } from "@/services/auth.service";
import { User } from "@/types";

interface Props {
  // CHANGED: now takes chatId string instead of full Chat object
  chatId: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function ChatWindow({ chatId, onBack, showBack }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);
  const [otherUser, setOtherUser] = useState<User | undefined>();
  const [sending, setSending] = useState(false);

  // CHANGED: get real user from auth store
  const { user } = useAuthStore();
  // CHANGED: get real chats, messages and user cache from chat store
  const { chats, messages, usersCache, cacheUser } = useChatStore();

  // CHANGED: subscribe to real messages from Firestore
  useMessages(chatId);

  const chat = chats.find(c => c.id === chatId);
  // CHANGED: get real messages from store instead of chat.messages array
  const msgs = messages[chatId] || [];

  // CHANGED: load other user's real data
  // CHANGED: subscribe to real-time updates for other user
// so online/offline status updates instantly


useEffect(() => {
  if (!chat || !user) return;
  const oid = chat.participants.find(p => p !== user.id);
  if (!oid) return;

  // Show cached version immediately so no offline flash
  if (usersCache[oid]) {
    setOtherUser(usersCache[oid]);
  }

  // Then subscribe for real-time status updates
  const unsub = subscribeToUser(oid, (u) => {
    cacheUser(u);
    setOtherUser(u);
  });

  return () => unsub();
}, [chat?.id, user?.id]);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  const bgImage = isDark ? "/chat-bg-dark.jpg" : "/chat-bg-white.jpg";

  if (!chat) return (
    <div className="flex-1 flex items-center justify-center">
      <Spinner />
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* CHANGED: pass real otherUser instead of chat.participantName */}
      <ChatHeader otherUser={otherUser} onBack={onBack} showBack={showBack} isDark={isDark} />

      <div
        className="flex-1 overflow-y-auto relative"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: isDark ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.15)" }}
        />

        <div className="relative z-10 px-4 py-4 scrollbar-thin min-h-full">
          {msgs.length === 0 && (
            <div className="flex items-center justify-center h-full py-20">
              <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-6 py-3 text-white text-sm">
                Send a message to start chatting!
              </div>
            </div>
          )}
          <div className="space-y-0.5">
            {msgs.map(msg => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === user?.id}
                // CHANGED: real delete using Firestore soft delete
                onDelete={async (id) => await deleteMessage(chatId, id)}
                isDark={isDark}
              />
            ))}
          </div>
          <div ref={endRef} />
        </div>
      </div>

      {/* CHANGED: send real message to Firestore */}
      <MessageInput
        onSend={async (text) => {
          if (!user || !chat || sending) return;
          setSending(true);
          try {
            await sendMessage(chatId, user.id, user.email, user.displayName, text, chat.participants);
          } finally {
            setSending(false);
          }
        }}
        isDark={isDark}
        disabled={sending}
      />
    </div>
  );
}