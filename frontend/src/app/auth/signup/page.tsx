"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Mail, ArrowRight, Lock, User } from "lucide-react";
import { requestOtp, verifyOtp } from "@/lib/api";
import { Card } from "@/components/ui/Card";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await requestOtp(email);
      toast.success("OTP sent to your email");
      setStep("otp");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await verifyOtp(email, otp);
      Cookies.set("token", data.token, { expires: 7 });
      toast.success("Account created!");
      router.push("/");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-8">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-brand-pink text-2xl font-black text-white ink-border ink-shadow-sm">
          C
        </span>
        <h1 className="text-2xl font-black text-ink uppercase tracking-tight">Create Account</h1>
        <p className="mt-1 text-sm font-bold text-muted tracking-wider">
          {step === "email" ? "Enter your email to get started" : "Check your inbox for the OTP"}
        </p>
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-ink uppercase tracking-widest">
              Email
            </label>
            <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 ink-border ink-shadow-sm">
              <Mail className="size-4 shrink-0 text-muted" strokeWidth={3} />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm font-bold text-ink outline-none placeholder:text-muted"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-black text-white uppercase tracking-widest ink-border ink-shadow-sm transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send OTP"}
            <ArrowRight className="size-4" strokeWidth={3} />
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="rounded-xl bg-brand-yellow/20 px-4 py-3 text-center ink-border ink-shadow-sm">
            <p className="text-xs font-bold text-ink tracking-wider">
              OTP sent to <span className="font-black">{email}</span>
            </p>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="mt-1 text-[11px] font-bold text-muted underline underline-offset-2 tracking-wider hover:text-ink"
            >
              Change email
            </button>
          </div>
          <div>
            <label htmlFor="otp" className="mb-1.5 block text-xs font-bold text-ink uppercase tracking-widest">
              OTP
            </label>
            <div className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 ink-border ink-shadow-sm">
              <Lock className="size-4 shrink-0 text-muted" strokeWidth={3} />
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full bg-transparent text-sm font-bold text-ink tracking-[0.25em] outline-none placeholder:text-muted"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || otp.length < 4}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-black text-white uppercase tracking-widest ink-border ink-shadow-sm transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Create Account"}
            <ArrowRight className="size-4" strokeWidth={3} />
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-xs font-bold text-muted tracking-wider">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-ink underline underline-offset-2 hover:text-brand-pink">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
