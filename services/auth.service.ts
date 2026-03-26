import {
  collection, doc, getDocs, getDoc, setDoc, updateDoc,
  query, where, serverTimestamp, Timestamp, onSnapshot,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import { db } from "@/lib/firebase";
import { User, UserSession } from "@/types";


const USERS = "users";
const SESSION_KEY = "tg_session";

function docToUser(id: string, d: Record<string, unknown>): User {
  return {
    id,
    email: d.email as string,
    password: d.password as string,
    displayName: d.displayName as string,
    photoURL: (d.photoURL as string) || undefined,
    bio: (d.bio as string) || undefined,
    online: (d.online as boolean) ?? false,
    isActive: (d.isActive as boolean) ?? true,
    lastSeen: d.lastSeen instanceof Timestamp ? d.lastSeen.toDate() : null,
    createdAt: d.createdAt instanceof Timestamp ? d.createdAt.toDate() : new Date(),
  };
}

export async function signUp(email: string, password: string, displayName: string): Promise<UserSession> {
  const q = query(collection(db, USERS), where("email", "==", email.toLowerCase()));
  const snap = await getDocs(q);
  if (!snap.empty) throw new Error("Email already in use");

  const hashed = await bcrypt.hash(password, 10);
  const id = doc(collection(db, USERS)).id;

  await setDoc(doc(db, USERS, id), {
    email: email.toLowerCase(), password: hashed, displayName,
    photoURL: "", bio: "", online: true, isActive: true,
    lastSeen: serverTimestamp(), createdAt: serverTimestamp(),
  });

  const session: UserSession = {
    id, email: email.toLowerCase(), displayName,
    photoURL: "", online: true, isActive: true,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signIn(email: string, password: string): Promise<UserSession> {
  const q = query(collection(db, USERS), where("email", "==", email.toLowerCase()));
  const snap = await getDocs(q);
  if (snap.empty) throw new Error("Invalid email or password");

  const userDoc = snap.docs[0];
  const user = docToUser(userDoc.id, userDoc.data() as Record<string, unknown>);
  if (!user.isActive) throw new Error("Your account has been disabled.");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid email or password");

  await updateDoc(doc(db, USERS, user.id), {
    online: true, lastSeen: serverTimestamp(),
  });

  const session: UserSession = {
    id: user.id, email: user.email, displayName: user.displayName,
    photoURL: user.photoURL, bio: user.bio, online: true, isActive: true,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function signOut(userId: string): Promise<void> {
  try {
    await updateDoc(doc(db, USERS, userId), {
      online: false, lastSeen: serverTimestamp(),
    });
  } catch {}
  localStorage.removeItem(SESSION_KEY);
}

export function getStoredSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch { return null; }
}

export async function getUserById(userId: string): Promise<User | null> {
  const snap = await getDoc(doc(db, USERS, userId));
  if (!snap.exists()) return null;
  return docToUser(snap.id, snap.data() as Record<string, unknown>);
}

export async function getAllUsers(): Promise<User[]> {
  const snap = await getDocs(collection(db, USERS));
  return snap.docs.map(d => docToUser(d.id, d.data() as Record<string, unknown>));
}

export async function searchUsers(term: string, currentUserId: string): Promise<User[]> {
  const snap = await getDocs(collection(db, USERS));
  const lower = term.toLowerCase();
  return snap.docs
    .map(d => docToUser(d.id, d.data() as Record<string, unknown>))
    .filter(u =>
      u.id !== currentUserId && u.isActive &&
      (u.email.toLowerCase().includes(lower) || u.displayName.toLowerCase().includes(lower))
    );
}

export async function updateUserStatus(userId: string, online: boolean): Promise<void> {
  await updateDoc(doc(db, USERS, userId), {
    online, lastSeen: serverTimestamp(),
  });
}

export async function toggleUserActive(userId: string, isActive: boolean): Promise<void> {
  await updateDoc(doc(db, USERS, userId), { isActive });
}

// CHANGED: added real-time listener for a user's online status

export function subscribeToUser(userId: string, cb: (user: User) => void): () => void {
  return onSnapshot(doc(db, USERS, userId), (snap) => {
    if (snap.exists()) {
      cb(docToUser(snap.id, snap.data() as Record<string, unknown>));
    }
  });
}