import { create } from "zustand";
import { UserSession } from "@/types";
import { getStoredSession } from "@/services/auth.service";

interface AuthState {
  user: UserSession | null;
  isLoading: boolean;
  setUser: (user: UserSession | null) => void;
  setLoading: (v: boolean) => void;
  initFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  initFromStorage: () => set({ user: getStoredSession(), isLoading: false }),
}));