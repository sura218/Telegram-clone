"use client";
import { useEffect } from "react";
import { subscribeToMessages, markMessagesAsSeen } from "@/services/chat.service";
import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";

export function useMessages(chatId: string | null) {
  const user = useAuthStore(s => s.user);
  const setMessages = useChatStore(s => s.setMessages);
  useEffect(() => {
    if (!chatId || !user) return;
    return subscribeToMessages(chatId, (messages) => {
      setMessages(chatId, messages);
      const unseen = messages
        .filter(m => !m.seenBy.includes(user.id) && m.senderId !== user.id && !m.deleted)
        .map(m => m.id);
      if (unseen.length) markMessagesAsSeen(chatId, user.id, unseen);
    });
  }, [chatId, user, setMessages]);
}