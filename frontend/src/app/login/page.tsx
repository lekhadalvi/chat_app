"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

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

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState<HeartParticle[]>([]);
  
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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("WHOA! USERNAME CANNOT BE BLANK!");
      return;
    }
    if (!password.trim()) {
      setError("OOPS! PASSWORD CANNOT BE BLANK!");
      return;
    }

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSuccess("HELL YEAH! LOGGED IN SUCCESSFULLY!");
      
      // Store mock user info in local storage
      localStorage.setItem("zap_user_name", username.trim());
      localStorage.setItem("zap_authenticated", "true");

      // Redirect to chats dashboard after 800ms
      setTimeout(() => {
        router.push("/chats");
      }, 800);
    }, 1200);
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
      <div className="flex flex-col items-center mt-10 md:mt-14 mb-4 select-none relative z-10">
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
              YO! SIGN IN
            </h2>
          </div>

          {/* Form Actions */}
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-[#FF5E5E] border-[3px] border-black p-3 text-white font-lilita text-sm tracking-wide shadow-[3px_3px_0px_#000] animate-pulse">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-[#4CD964] border-[3px] border-black p-3 text-black font-lilita text-sm tracking-wide shadow-[3px_3px_0px_#000]">
                {success}
              </div>
            )}

            {/* Username Input Group */}
            <div className="flex flex-col gap-1.5">
              <label className="font-lilita text-xs tracking-wider uppercase text-black/70">
                USERNAME
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="GamerTag_99"
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
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input Group */}
            <div className="flex flex-col gap-1.5">
              <label className="font-lilita text-xs tracking-wider uppercase text-black/70">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="........"
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
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zap-purple text-white font-lilita text-xl py-3.5 uppercase border-[3.5px] border-black rounded-sm shadow-[5px_5px_0px_rgba(0,0,0,1)] cursor-pointer select-none hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:bg-purple-900/50 disabled:cursor-not-allowed"
            >
              {loading ? "LOGGING IN..." : "LOGIN!"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6 select-none">
            <div className="flex-grow h-[2px] bg-black"></div>
            <span className="font-lilita text-[10px] md:text-xs tracking-wider uppercase text-black/75">
              OR USE THESE
            </span>
            <div className="flex-grow h-[2px] bg-black"></div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3.5 select-none">
            <button
              onClick={() => alert("Google Login Pressed!")}
              className="bg-zap-cyan text-black font-lilita text-sm py-3 px-3.5 border-[3px] border-black rounded-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.72 5.72 0 0 1 8.28 12.87a5.72 5.72 0 0 1 5.711-5.73 5.48 5.48 0 0 1 3.9 1.55l3.11-3.11A9.9 9.9 0 0 0 13.99 3c-5.52 0-10 4.48-10 10s4.48 10 10 10c5.77 0 9.6-4.06 9.6-9.77 0-.66-.06-1.3-.17-1.945H12.24Z" />
              </svg>
              <span>GOOGLE</span>
            </button>

            <button
              onClick={() => alert("Discord Login Pressed!")}
              className="bg-[#5865F2] text-white font-lilita text-sm py-3 px-3.5 border-[3px] border-black rounded-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all"
            >
              <svg viewBox="0 0 127.14 96.36" className="w-5 h-5 flex-shrink-0" fill="currentColor">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.2,77.2,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.88,6.83,77.2,77.2,0,0,0,49.58,0,105.15,105.15,0,0,0,19.14,8.07C3,31.58-1.45,54.47,1,77.06A107.4,107.4,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,71.43,71.43,0,0,1-10.5-5c.89-.65,1.76-1.34,2.58-2.07a76.88,76.88,0,0,0,72.24,0c.83.73,1.69,1.42,2.58,2.07a71.43,71.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,107.4,107.4,0,0,0,31-19.3C129.89,47.88,124.62,25.29,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.88,46,53.88,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.12,46,96.12,53,91,65.69,84.69,65.69Z" />
              </svg>
              <span>DISCORD</span>
            </button>
          </div>

          {/* Form Footer Links */}
          <div className="flex flex-col items-center gap-2.5 mt-6 pt-4 border-t-[2.5px] border-black select-none text-center">
            <span className="font-semibold text-xs tracking-wider">
              New here?{" "}
              <span
                onClick={() => alert("Join Squad Pressed!")}
                className="text-zap-purple underline font-black cursor-pointer hover:text-purple-800 transition-colors"
              >
                JOIN THE SQUAD
              </span>
            </span>
            <span
              onClick={() => alert("Forgot Password Pressed!")}
              className="text-[10px] md:text-xs font-black tracking-widest text-black/60 cursor-pointer hover:text-black transition-colors"
            >
              I FORGOT MY PASSWORD... OOPS
            </span>
          </div>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex items-center gap-5 my-6 select-none relative z-25">
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
      </div>
    </div>
  );
}
