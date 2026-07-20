"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { authService } from "../../services/authService";

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotStart: number;
  rotEnd: number;
  wobbleDist: number;
}

interface AuthFormInput {
  email: string;
  otp: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState<HeartParticle[]>([]);

  const { register, handleSubmit, formState: { errors }, watch, resetField } = useForm<AuthFormInput>({
    defaultValues: {
      email: "",
      otp: ""
    }
  });

  const emailValue = watch("email");
  
  const formRef = useRef<HTMLDivElement>(null);

  // Clean up expired click particles
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setParticles((prev) => prev.filter((p) => now - p.id < 1200));
    }, 150);
    return () => clearInterval(interval);
  }, [particles]);

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid spawning hearts if user clicks inside the login form
    if (formRef.current && formRef.current.contains(e.target as Node)) {
      return;
    }

    const colors = [
      "var(--color-zap-purple)",
      "var(--color-zap-cyan)",
      "var(--color-zap-yellow)",
      "var(--color-zap-pink)",
      "#FF5E5E",
    ];

    const newParticles: HeartParticle[] = [];
    const count = 5 + Math.floor(Math.random() * 3); // 5 to 7 hearts

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * 360 * Math.PI) / 180;
      const distance = Math.random() * 20;
      const offsetX = Math.cos(angle) * distance;
      const offsetY = Math.sin(angle) * distance;

      newParticles.push({
        id: Date.now() + Math.random(),
        x: e.clientX + offsetX,
        y: e.clientY + offsetY,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.floor(Math.random() * 12) + 20,
        rotStart: Math.random() * 30 - 15,
        rotEnd: Math.random() * 50 - 25,
        wobbleDist: Math.random() * 24 - 12,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  const handleLoginSubmit = async (data: AuthFormInput) => {
    setError("");
    setSuccess("");

    if (step === "email") {
      setLoading(true);
      try {
        const resData = await authService.login(data.email);
        setSuccess(resData.message || "OTP SENT TO YOUR MAIL!");
        setStep("otp");
      } catch (err: any) {
        setError(err.message || "COULD NOT CONNECT TO THE SQUAD SERVER!");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const resData = await authService.verify(data.email, data.otp);
        setSuccess(
          isSignUp 
            ? "HELL YEAH! SIGNED UP SUCCESSFULLY! WELCOME!" 
            : "HELL YEAH! LOGGED IN SUCCESSFULLY!"
        );
        
        const user = resData.user;
        // Store backend info in local storage
        localStorage.setItem("zap_user_name", user.name || data.email.slice(0, 8));
        localStorage.setItem("zap_authenticated", "true");
        localStorage.setItem("zap_token", resData.token);

        // Redirect to chats dashboard after 800ms
        setTimeout(() => {
          router.push("/chats");
        }, 800);
      } catch (err: any) {
        setError(err.message || "COULD NOT VERIFY THE OTP!");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      onClick={handleScreenClick}
      className="min-h-screen w-full relative overflow-x-hidden flex flex-col items-center justify-between p-6 select-none font-comic text-black bg-transparent"
      style={{ cursor: "pointer" }}
    >
      {/* Dotted grid background container */}
      <div className="absolute inset-0 pointer-events-none opacity-100" style={{ zIndex: 0 }} />

      {/* Pink lightning bolt (Top-Left decoration) */}
      <div className="absolute top-6 left-6 md:top-12 md:left-16 w-16 h-20 md:w-24 md:h-28 text-zap-pink opacity-85 transform -rotate-12 select-none pointer-events-none transition-transform duration-300 hover:rotate-6 z-10">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          fill="currentColor"
          stroke="black"
          strokeWidth="3"
        >
          <polygon points="60,5 20,55 50,55 40,95 80,45 50,45" />
        </svg>
      </div>

      {/* Mint Star (Bottom-Right decoration) */}
      <div className="absolute bottom-6 right-6 md:bottom-16 md:right-20 w-16 h-16 md:w-24 md:h-24 text-[#C4E8E2] opacity-85 transform rotate-12 select-none pointer-events-none transition-transform duration-300 hover:-rotate-12 z-10">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          fill="currentColor"
          stroke="black"
          strokeWidth="3.5"
        >
          <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" />
        </svg>
      </div>

      {/* Floating Hearts Click Particles Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-heart"
            style={
              {
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                "--rot-start": `${p.rotStart}deg`,
                "--rot-end": `${p.rotEnd}deg`,
                "--wobble-dist": `${p.wobbleDist}px`,
              } as React.CSSProperties
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill={p.color}
              stroke="black"
              strokeWidth="2.5"
              className="w-full h-full filter drop-shadow-[1px_2px_0px_rgba(0,0,0,1)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Header Title Section */}
      <div className="flex flex-col items-center  mb-4 select-none relative z-10">
        <div className="relative flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <div className="relative">
            {/* Back Magenta Slanted Title */}
            <h1 className="font-lilita text-[4.2rem] leading-[0.9] md:text-[5.5rem] uppercase italic tracking-wider text-zap-purple transform -skew-x-12 select-none">
              ZAP!<br className="hidden md:block" />CHAT
            </h1>
            {/* Front Olive-Gold Slanted Title */}
            <h1
              className="absolute inset-0 font-lilita text-[4.2rem] leading-[0.9] md:text-[5.5rem] uppercase italic tracking-wider text-[#5C5424] transform -skew-x-12 select-none -translate-x-[4px] -translate-y-[4px] pointer-events-none"
              style={{ WebkitTextStroke: "2.5px black" }}
            >
              ZAP!<br className="hidden md:block" />CHAT
            </h1>
          </div>

          {/* Slanted Chaos Badge */}
          <div className="bg-black text-white font-lilita text-sm md:text-md uppercase py-1.5 px-3.5 border-2 border-white rounded-none shadow-[3px_3px_0px_rgba(0,0,0,1)] transform -rotate-[6deg] md:-rotate-[8deg] mt-3 md:mt-2 hover:rotate-3 transition-transform duration-200">
            JOIN THE CHAOS!
          </div>
        </div>
      </div>

      {/* Main Login Card Wrapper */}
      <div
        ref={formRef}
        className="w-full max-w-[420px] relative mt-2 mb-8 select-text cursor-default z-20"
      >
        {/* Layered Paper Stack Background Elements */}
        {/* Backmost Shadow Paper */}
        <div className="absolute inset-0 bg-black rounded-sm translate-x-2 translate-y-2 border-[3.5px] border-black"></div>
        {/* Middle Offset Paper */}
        <div className="absolute inset-0 bg-white rounded-sm translate-x-1 translate-y-1 border-[3.5px] border-black transform rotate-[0.6deg]"></div>
        
        {/* Foreground Active Card */}
        <div className="relative bg-white rounded-sm border-[3.5px] border-black transform -rotate-[0.5deg] p-6 md:p-8 flex flex-col">
          {/* Card Header with Waving Hand Icon */}
          <div className="flex items-center gap-2 mb-6 border-b-[3px] border-black pb-4 select-none">
            {/* Yo! Hand Emoji / Comic Icon */}
            <div className="w-9 h-9 text-black relative flex-shrink-0 animate-bounce">
              <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#FFE082"
                  d="M14.5 13.5V6.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5m-3-1v-4c0-.83-.67-1.5-1.5-1.5S7 5.17 7 6v8.5c0 2.21 1.79 4 4 4h3.5c1.93 0 3.5-1.57 3.5-3.5v-2c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.5"
                />
                <path strokeLinecap="round" d="M3 8a3 3 0 0 1 1-2.5M2.5 12.5a4 4 0 0 1 1.5-3M21 7.5a3 3 0 0 0-1-2" />
              </svg>
            </div>
            <h2 className="font-lilita text-2xl md:text-3xl tracking-wide uppercase">
              {isSignUp ? "YO! SIGN UP" : "YO! SIGN IN"}
            </h2>
          </div>

          {/* Form Actions */}
          <form onSubmit={handleSubmit(handleLoginSubmit)} className="flex flex-col gap-5">
            {(errors.email || errors.otp || error) && (
              <div className="bg-[#FF5E5E] border-[3px] border-black p-3 text-white font-lilita text-sm tracking-wide shadow-[3px_3px_0px_#000] animate-pulse flex flex-col gap-1 select-none">
                {errors.email && <span>{errors.email.message}</span>}
                {errors.otp && <span>{errors.otp.message}</span>}
                {error && <span>{error}</span>}
              </div>
            )}
            {success && (
              <div className="bg-[#4CD964] border-[3px] border-black p-3 text-black font-lilita text-sm tracking-wide shadow-[3px_3px_0px_#000] select-none">
                {success}
              </div>
            )}

            {/* Email / OTP Input Group */}
            {step === "email" ? (
              <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                <label className="font-lilita text-xs tracking-wider uppercase text-black/70">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="gamer@zaptalk.com"
                    {...register("email", {
                      required: "WHOA! EMAIL CANNOT BE BLANK!",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "OOPS! THAT DOESN'T LOOK LIKE A VALID EMAIL!"
                      }
                    })}
                    className="w-full bg-white text-black font-semibold placeholder-black/40 border-[3px] border-black px-4 py-3 pr-11 rounded-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-amber-50 focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/50 pointer-events-none w-5 h-5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
                <div className="flex justify-between items-center">
                  <label className="font-lilita text-xs tracking-wider uppercase text-black/70">
                    ENTER OTP CODE
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      resetField("otp");
                      setError("");
                      setSuccess("");
                    }}
                    className="text-xs text-zap-purple underline font-black hover:text-purple-800"
                  >
                    CHANGE EMAIL
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="12345"
                    {...register("otp", {
                      required: "WHOA! OTP CANNOT BE BLANK!"
                    })}
                    className="w-full bg-white text-black font-semibold placeholder-black/40 border-[3px] border-black px-4 py-3 pr-11 rounded-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-amber-50 focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/50 pointer-events-none w-5 h-5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                </div>
                <span className="text-[10px] text-black/50 mt-1 font-semibold">
                  Sent to {emailValue}. Check your inbox!
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zap-purple text-white font-lilita text-xl py-3.5 uppercase border-[3.5px] border-black rounded-sm shadow-[5px_5px_0px_rgba(0,0,0,1)] cursor-pointer select-none hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:bg-purple-900/50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (step === "email" ? "SENDING CODE..." : "VERIFYING...") 
                : (step === "email" ? "GET OTP!" : "LET ME IN!")}
            </button>
          </form>

          {/* Form Footer Links */}
          <div className="flex flex-col items-center gap-2.5 mt-6 pt-4 border-t-[2.5px] border-black select-none text-center">
            <span className="font-semibold text-xs tracking-wider">
              {isSignUp ? "Already a member? " : "New here? "}
              <span
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setStep("email");
                  resetField("otp");
                  setError("");
                  setSuccess("");
                }}
                className="text-zap-purple underline font-black cursor-pointer hover:text-purple-800 transition-colors"
              >
                {isSignUp ? "SIGN IN" : "JOIN THE SQUAD"}
              </span>
            </span>
            <span
              className="text-[10px] md:text-xs font-black tracking-widest text-black/60 cursor-default"
            >
              SECURED WITH PASSWORDLESS MAGIC CODES ⚡
            </span>
            <div className="flex items-center gap-3 mt-1 font-lilita text-[10px] uppercase text-black/70">
              <Link href="/privacy" className="underline hover:text-black transition-colors">
                PRIVACY POLICY
              </Link>
              <span>•</span>
              <Link href="/terms" className="underline hover:text-black transition-colors">
                TERMS & CONDITIONS
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      {/* <div className="flex items-center gap-5 my-6 select-none relative z-25">
        <button
          onClick={() => alert("Chat Clicked!")}
          className="w-14 h-14 bg-zap-yellow border-[3.5px] border-black rounded-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
          </svg>
        </button>

        <button
          onClick={() => alert("Squad Clicked!")}
          className="w-14 h-14 bg-[#BBEBFF] border-[3.5px] border-black rounded-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm14 10v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75" />
          </svg>
        </button>

        <button
          onClick={() => alert("Sparkles Clicked!")}
          className="w-14 h-14 bg-zap-pink border-[3.5px] border-black rounded-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l-.813-5.096L3 15l5.188-.904L9 9l.813 5.096L15 15l-5.187.904ZM19.071 4.929l-.357 2.228-.358-2.228-2.227-.358 2.227-.357.358-2.228.357 2.228 2.228.357-2.228.358ZM19.071 19.071l-.357 2.228-.358-2.228-2.227-.358 2.227-.357.358-2.228.357 2.228 2.228.357-2.228.358Z" />
          </svg>
        </button>
      </div> */}
    </div>
  );
}
