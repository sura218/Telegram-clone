import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { Message } from "@/types";
import { formatMessageTime } from "@/utils/format";

interface Props {
  message: Message;
  isOwn: boolean;
  // CHANGED: added onDelete for real Firestore soft delete
  onDelete?: (id: string) => void;
  isDark?: boolean;
}

export function MessageBubble({ message, isOwn, onDelete, isDark }: Props) {
  const [hover, setHover] = useState(false);
  // CHANGED: check seenBy array instead of simple seen boolean
  const seenByOther = message.seenBy?.some(id => id !== message.senderId);

  return (
    <div
      className={cn("flex animate-msg mb-1", isOwn ? "justify-end" : "justify-start")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className={cn("flex items-end gap-1.5 max-w-[70%]", isOwn ? "flex-row-reverse" : "flex-row")}>
        {/* CHANGED: delete button calls real Firestore delete */}
        {isOwn && hover && !message.deleted && onDelete && (
          <button onClick={() => onDelete(message.id)} className="p-1 rounded-full text-gray-400 hover:text-red-500 transition">
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
        <div
          className={cn("rounded-2xl px-3.5 py-2 shadow-sm", isOwn ? "rounded-br-sm" : "rounded-bl-sm")}
          style={{ backgroundColor: isOwn
            ? isDark ? "#2B5278" : "#DCF8C6"
            : isDark ? "#182533" : "#FFFFFF"
          }}
        >
          {/* CHANGED: show deleted state from Firestore deleted flag */}
          {message.deleted ? (
            <p className="text-sm italic text-gray-400">This message was deleted</p>
          ) : (
            <p className="text-sm break-words leading-relaxed"
              style={{ color: isDark ? "#e2e8f0" : "#1a202c" }}>
              {message.text}
            </p>
          )}
          <div className={cn("flex items-center gap-1 mt-1", isOwn ? "justify-end" : "justify-start")}>
            <span className="text-[10px] text-gray-400 leading-none">
              {formatMessageTime(message.timestamp)}
            </span>
            {isOwn && !message.deleted && (
              // CHANGED: double check uses real seenBy array from Firestore
              <span className={cn("flex -space-x-1.5", seenByOther ? "text-tg-blue" : "text-gray-400")}>
                <CheckIcon className="w-3 h-3" />
                {seenByOther && <CheckIcon className="w-3 h-3" />}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}