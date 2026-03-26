"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/Input";
import  Button  from "@/components/ui/Button";
// CHANGED: real signUp service and auth store
import { useAuthStore } from "@/store/auth.store";
import { signUp } from "@/services/auth.service";

export default function SignupPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState({ displayName: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) router.replace("/chat");
  }, [user]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.displayName.trim()) e.displayName = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (form.password.length < 6) e.password = "Min. 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      // CHANGED: real signUp to Firestore with bcrypt hashing
      const session = await signUp(form.email, form.password, form.displayName);
      setUser(session);
      router.push("/chat");
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : "Signup failed" });
    } finally {
      setLoading(false);
    }
  };

  const u = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-tg-blue/10 via-white to-blue-50 dark:from-tg-dark-bg dark:to-tg-dark-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-tg-blue flex items-center justify-center shadow-lg mb-4">
            <svg className="w-11 h-11 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">Join and start messaging</p>
        </div>

        <div className="bg-white dark:bg-tg-dark-sidebar rounded-2xl shadow-xl p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" label="Display Name" value={form.displayName}
              onChange={u("displayName")} placeholder="Your name"
              leftIcon={<UserIcon className="w-4 h-4" />} />
            {errors.displayName && <p className="text-xs text-red-500 -mt-2">{errors.displayName}</p>}

            <Input type="email" label="Email" value={form.email}
              onChange={u("email")} placeholder="you@example.com"
              leftIcon={<EnvelopeIcon className="w-4 h-4" />} />
            {errors.email && <p className="text-xs text-red-500 -mt-2">{errors.email}</p>}

            <Input type="password" label="Password" value={form.password}
              onChange={u("password")} placeholder="Min. 6 characters"
              leftIcon={<LockClosedIcon className="w-4 h-4" />} />
            {errors.password && <p className="text-xs text-red-500 -mt-2">{errors.password}</p>}

            <Input type="password" label="Confirm Password" value={form.confirm}
              onChange={u("confirm")} placeholder="Repeat password"
              leftIcon={<LockClosedIcon className="w-4 h-4" />} />
            {errors.confirm && <p className="text-xs text-red-500 -mt-2">{errors.confirm}</p>}

            {errors.general && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-xl border border-red-100">
                {errors.general}
              </div>
            )}

            <Button type="submit" className="w-full py-3" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="text-center text-xs text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-tg-blue hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}