"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tg-blue/10 via-white to-blue-50 dark:from-tg-dark-bg dark:to-tg-dark-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-tg-blue flex items-center justify-center shadow-lg mb-4">
            <svg className="w-11 h-11 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
        </div>

        <div className="bg-white dark:bg-tg-dark-sidebar rounded-2xl shadow-xl p-6 space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" label="Email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" leftIcon={<EnvelopeIcon className="w-4 h-4" />} />
            <Input type="password" label="Password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" leftIcon={<LockClosedIcon className="w-4 h-4" />} />
            <Button type="submit" className="w-full py-3">Sign In</Button>
          </form>
          <p className="text-center text-xs text-gray-400">This is a frontend demo — any input works</p>
        </div>
      </div>
    </div>
  );
}