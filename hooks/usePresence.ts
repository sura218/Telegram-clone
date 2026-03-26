"use client";
import { useEffect, useRef } from "react";
import { updateUserStatus } from "@/services/auth.service";

export function usePresence(userId?: string) {
  const userIdRef = useRef(userId);

  // CHANGED: always keep ref updated without re-running effect
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    // Set online immediately
    updateUserStatus(userId, true);

    // CHANGED: removed visibilitychange — it was setting offline
    // every time you switched browser tabs while testing
    // Only set offline when tab is actually closed             
    const onUnload = () => {
      if (userIdRef.current) {
        updateUserStatus(userIdRef.current, false);
      }
    };

    window.addEventListener("beforeunload", onUnload);

    return () => {
      window.removeEventListener("beforeunload", onUnload);
      // CHANGED: no offline call here — prevents flicker on re-render
    };
  }, [userId]);
}