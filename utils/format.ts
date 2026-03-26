import { format, isToday, isYesterday, differenceInMinutes } from "date-fns";

export function formatMessageTime(date: Date | null | undefined): string {
  if (!date) return "";
  try { return format(date, "HH:mm"); } catch { return ""; }
}

export function formatChatTime(date: Date | null | undefined): string {
  if (!date) return "";
  try {
    if (isToday(date)) return format(date, "HH:mm");
    if (isYesterday(date)) return "Yesterday";
    return format(date, "dd/MM/yy");
  } catch { return ""; }
}

export function formatLastSeen(date: Date | null | undefined): string {
  if (!date) return "a long time ago";
  try {
    const mins = differenceInMinutes(new Date(), date);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    if (isToday(date)) return `today at ${format(date, "HH:mm")}`;
    if (isYesterday(date)) return `yesterday at ${format(date, "HH:mm")}`;
    return `${format(date, "dd/MM/yy")} at ${format(date, "HH:mm")}`;
  } catch { return "unknown"; }
}

export function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  return null;
}