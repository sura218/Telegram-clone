export interface User {
  id: string;
  email: string;
  password: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  online: boolean;
  isActive: boolean;
  lastSeen: Date | null;
  createdAt: Date;
}

export interface UserSession {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  online: boolean;
  isActive: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  participantEmails: string[];
  type: "private" | "group";
  lastMessage?: string;
  lastMessageTime?: Date | null;
  lastMessageSender?: string;
  createdAt: Date;
  createdBy: string;
  unreadCount: Record<string, number>;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderEmail: string;
  senderName: string;
  text: string;
  timestamp: Date;
  seen: boolean;
  seenBy: string[];
  deleted: boolean;
}

export interface Settings {
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  chatBackground: string;
  customBackgroundUrl: string;
  notifications: boolean;
  sound: boolean;
  enterToSend: boolean;
  showLastSeen: boolean;
}