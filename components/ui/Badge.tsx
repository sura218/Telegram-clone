import { cn } from "@/utils/cn"

export default function Badge({count, className }: {count: number; className?: string}) {
    if(!count) return null;
  return (
    <span className={cn("inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold bg-telegram-blue text-white", className)}>
        {count > 99 ? "99+" : count}
    </span>
  );
}
