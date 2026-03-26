import { create } from "zustand";
import { Chat, Message, User } from "@/types";

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  messages: Record<string, Message[]>;
  usersCache: Record<string, User>;
  setChats: (chats: Chat[]) => void;
  setActiveChat: (id: string | null) => void;
  setMessages: (chatId: string, messages: Message[]) => void;
  cacheUser: (user: User) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  activeChatId: null,
  messages: {},
  usersCache: {},
  setChats: (chats) => set({ chats }),
  setActiveChat: (activeChatId) => set({ activeChatId }),
  setMessages: (chatId, messages) =>
    set((s) => ({ messages: { ...s.messages, [chatId]: messages } })),
  cacheUser: (user) =>
    set((s) => ({ usersCache: { ...s.usersCache, [user.id]: user } })),
}));