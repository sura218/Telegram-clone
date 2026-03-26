import { Chat } from "@/types";

export const MOCK_USER = {
  id: "me",
  displayName: "You",
  email: "you@example.com",
  online: true,
};

export const MOCK_CHATS: Chat[] = [
  {
    id: "1",
    participantId: "alice",
    participantName: "Alice Johnson",
    participantOnline: true,
    lastMessage: "Hey! How are you doing?",
    lastMessageTime: new Date(),
    unread: 2,
    messages: [
      { id: "m1", senderId: "alice", senderName: "Alice Johnson", text: "Hey! How are you doing?", timestamp: new Date(Date.now() - 60000 * 5), seen: true, deleted: false },
      { id: "m2", senderId: "me", senderName: "You", text: "I'm good thanks! What about you?", timestamp: new Date(Date.now() - 60000 * 3), seen: true, deleted: false },
      { id: "m3", senderId: "alice", senderName: "Alice Johnson", text: "Doing great! Want to catch up later?", timestamp: new Date(Date.now() - 60000 * 1), seen: false, deleted: false },
    ],
  },
  {
    id: "2",
    participantId: "bob",
    participantName: "Bob Smith",
    participantOnline: false,
    lastMessage: "See you tomorrow!",
    lastMessageTime: new Date(Date.now() - 60000 * 60),
    unread: 0,
    messages: [
      { id: "m4", senderId: "bob", senderName: "Bob Smith", text: "Are we still on for tomorrow?", timestamp: new Date(Date.now() - 60000 * 120), seen: true, deleted: false },
      { id: "m5", senderId: "me", senderName: "You", text: "Yes of course!", timestamp: new Date(Date.now() - 60000 * 90), seen: true, deleted: false },
      { id: "m6", senderId: "bob", senderName: "Bob Smith", text: "See you tomorrow!", timestamp: new Date(Date.now() - 60000 * 60), seen: true, deleted: false },
    ],
  },
  {
    id: "3",
    participantId: "carol",
    participantName: "Carol White",
    participantOnline: true,
    lastMessage: "Thanks for the help!",
    lastMessageTime: new Date(Date.now() - 60000 * 60 * 3),
    unread: 0,
    messages: [
      { id: "m7", senderId: "me", senderName: "You", text: "Did you finish the project?", timestamp: new Date(Date.now() - 60000 * 200), seen: true, deleted: false },
      { id: "m8", senderId: "carol", senderName: "Carol White", text: "Just finished it now!", timestamp: new Date(Date.now() - 60000 * 190), seen: true, deleted: false },
      { id: "m9", senderId: "carol", senderName: "Carol White", text: "Thanks for the help!", timestamp: new Date(Date.now() - 60000 * 180), seen: true, deleted: false },
    ],
  },
  {
    id: "4",
    participantId: "dave",
    participantName: "Dave Brown",
    participantOnline: false,
    lastMessage: "Sounds good to me 👍",
    lastMessageTime: new Date(Date.now() - 60000 * 60 * 24),
    unread: 1,
    messages: [
      { id: "m10", senderId: "dave", senderName: "Dave Brown", text: "Sounds good to me 👍", timestamp: new Date(Date.now() - 60000 * 60 * 24), seen: false, deleted: false },
    ],
  },
  {
    id: "5",
    participantId: "eve",
    participantName: "Eve Martinez",
    participantOnline: true,
    lastMessage: "Can you send me the file?",
    lastMessageTime: new Date(Date.now() - 60000 * 60 * 48),
    unread: 0,
    messages: [
      { id: "m11", senderId: "eve", senderName: "Eve Martinez", text: "Can you send me the file?", timestamp: new Date(Date.now() - 60000 * 60 * 48), seen: true, deleted: false },
      { id: "m12", senderId: "me", senderName: "You", text: "Sure, give me a sec", timestamp: new Date(Date.now() - 60000 * 60 * 47), seen: true, deleted: false },
    ],
  },
];