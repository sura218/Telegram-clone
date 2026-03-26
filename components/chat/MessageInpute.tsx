"use client";
import { useState, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { cn } from "@/utils/cn";

export function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const send = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div
      className="flex items-center gap-2 px-4 py-3 border-t"
      style={{
        backgroundColor: isDark ? "#17212B" : "#ffffff",
        borderColor: isDark ? "#2a3a4a" : "#e5e7eb",
      }}
    >
      <div
        className="flex-1 rounded-2xl px-4 py-2.5"
        style={{ backgroundColor: isDark ? "#242f3d" : "#f3f4f6" }}
      >
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Write a message..."
          className="w-full bg-transparent text-sm focus:outline-none"
          style={{ color: isDark ? "#ffffff" : "#111827" }}
        />
      </div>
      <button
        onClick={send}
        disabled={!text.trim()}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0",
          text.trim()
            ? "bg-tg-blue hover:bg-tg-dark-blue text-white shadow-md"
            : "text-gray-400 cursor-not-allowed"
        )}
        style={{ backgroundColor: text.trim() ? "#2AABEE" : isDark ? "#242f3d" : "#e5e7eb" }}
      >
        <PaperAirplaneIcon className="w-5 h-5" />
      </button>
    </div>
  );
}