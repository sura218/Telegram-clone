# Telegram Clone

A real-time messaging app built with:

- Next.js 16
- TypeScript
- Tailwind CSS v4
- Firebase Firestore
- Zustand
- bcryptjs

## Features
- Real-time messaging
- Online presence system
- Message read receipts
- Dark / Light mode
- Responsive design
- Custom authentication with bcrypt
- Message deletion
- Unread message badges
- User search

## Setup

1. Clone the repo
2. Run `npm install`
3. Create `.env.local` with your Firebase keys
4. Run `npm run dev`

## Environment Variables
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```