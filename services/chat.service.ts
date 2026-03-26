import {
  collection, doc, getDocs, getDoc, setDoc, updateDoc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  Timestamp, increment, arrayUnion, writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Chat, Message } from "@/types";

function toDate(val: unknown): Date | null {
  if (!val) return null;
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return null;
}

function docToChat(id: string, d: Record<string, unknown>): Chat {
  return {
    id,
    participants: (d.participants as string[]) || [],
    participantEmails: (d.participantEmails as string[]) || [],
    type: (d.type as "private" | "group") || "private",
    lastMessage: (d.lastMessage as string) || undefined,
    lastMessageTime: toDate(d.lastMessageTime),
    lastMessageSender: (d.lastMessageSender as string) || undefined,
    createdAt: toDate(d.createdAt) || new Date(),
    createdBy: (d.createdBy as string) || "",
    unreadCount: (d.unreadCount as Record<string, number>) || {},
  };
}

function docToMessage(id: string, chatId: string, d: Record<string, unknown>): Message {
  return {
    id, chatId,
    senderId: (d.senderId as string) || "",
    senderEmail: (d.senderEmail as string) || "",
    senderName: (d.senderName as string) || "",
    text: (d.text as string) || "",
    timestamp: toDate(d.timestamp) || new Date(),
    seen: (d.seen as boolean) ?? false,
    seenBy: (d.seenBy as string[]) || [],
    deleted: (d.deleted as boolean) ?? false,
  };
}

export async function getOrCreatePrivateChat(
  uid1: string, email1: string, uid2: string, email2: string
): Promise<Chat> {
  const q = query(
    collection(db, "chats"),
    where("type", "==", "private"),
    where("participants", "array-contains", uid1)
  );
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    const chat = docToChat(d.id, d.data() as Record<string, unknown>);
    if (chat.participants.includes(uid2)) return chat;
  }

  const ref = doc(collection(db, "chats"));
  const data = {
    participants: [uid1, uid2],
    participantEmails: [email1, email2],
    type: "private",
    lastMessage: "",
    lastMessageTime: null,
    lastMessageSender: "",
    createdAt: serverTimestamp(),
    createdBy: uid1,
    unreadCount: { [uid1]: 0, [uid2]: 0 },
  };
  await setDoc(ref, data);
  return docToChat(ref.id, { ...data, createdAt: new Date() });
}

export function subscribeToUserChats(userId: string, cb: (chats: Chat[]) => void): () => void {
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", userId)
  );
  return onSnapshot(q, snap => {
    const chats = snap.docs
      .map(d => docToChat(d.id, d.data() as Record<string, unknown>))
      .sort((a, b) => {
        const at = a.lastMessageTime?.getTime() || a.createdAt.getTime();
        const bt = b.lastMessageTime?.getTime() || b.createdAt.getTime();
        return bt - at;
      });
    cb(chats);
  });
}

export function subscribeToMessages(chatId: string, cb: (msgs: Message[]) => void): () => void {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("timestamp", "asc")
  );
  return onSnapshot(q, snap => {
    cb(snap.docs.map(d => docToMessage(d.id, chatId, d.data() as Record<string, unknown>)));
  });
}

export async function sendMessage(
  chatId: string, senderId: string, senderEmail: string,
  senderName: string, text: string, participants: string[]
): Promise<void> {
  const batch = writeBatch(db);

  const msgRef = doc(collection(db, "chats", chatId, "messages"));
  batch.set(msgRef, {
    senderId, senderEmail, senderName, text,
    timestamp: serverTimestamp(),
    seen: false, seenBy: [senderId], deleted: false,
  });

  const chatRef = doc(db, "chats", chatId);
  const update: Record<string, unknown> = {
    lastMessage: text,
    lastMessageTime: serverTimestamp(),
    lastMessageSender: senderName,
  };
  for (const pid of participants) {
    if (pid !== senderId) update[`unreadCount.${pid}`] = increment(1);
  }
  batch.update(chatRef, update);
  await batch.commit();
}

export async function markMessagesAsSeen(
  chatId: string, userId: string, msgIds: string[]
): Promise<void> {
  if (!msgIds.length) return;
  const batch = writeBatch(db);
  for (const id of msgIds) {
    batch.update(doc(db, "chats", chatId, "messages", id), {
      seen: true, seenBy: arrayUnion(userId),
    });
  }
  batch.update(doc(db, "chats", chatId), {
    [`unreadCount.${userId}`]: 0,
  });
  await batch.commit();
}

export async function deleteMessage(chatId: string, messageId: string): Promise<void> {
  await updateDoc(doc(db, "chats", chatId, "messages", messageId), {
    deleted: true, text: "This message was deleted",
  });
}