"use client";
import { useEffect } from "react";
import { subscribeToUserChats } from "@/services/chat.service";
import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";

export function useChats() {
  const user = useAuthStore(s => s.user);
  const setChats = useChatStore(s => s.setChats);
  useEffect(() => {
    if (!user) return;
    return subscribeToUserChats(user.id, setChats);
  }, [user, setChats]);
}