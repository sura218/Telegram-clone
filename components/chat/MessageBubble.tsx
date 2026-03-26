import { CheckIcon } from "@heroicons/react/24/outline";
import { cn } from "@/utils/cn";
import { Message } from "@/types";
import { formatMessageTime } from "@/utils/format";

interface Props {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: Props) {
  return (
    <div className={cn("flex animate-msg mb-1", isOwn ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[70%] rounded-2xl px-3.5 py-2 shadow-sm", isOwn ? "rounded-br-sm bg-tg-msg-out dark:bg-tg-dark-msg-out" : "rounded-bl-sm bg-tg-msg-in dark:bg-tg-dark-msg-in")}>
        <p className="text-sm break-words leading-relaxed text-gray-900 dark:text-gray-100">
          {message.text}
        </p>
        <div className={cn("flex items-center gap-1 mt-1", isOwn ? "justify-end" : "justify-start")}>
          <span className="text-[10px] text-gray-400 leading-none">{formatMessageTime(message.timestamp)}</span>
          {isOwn && (
            <span className={cn("flex -space-x-1.5", message.seen ? "text-tg-blue" : "text-gray-400")}>
              <CheckIcon className="w-3 h-3" />
              {message.seen && <CheckIcon className="w-3 h-3" />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}