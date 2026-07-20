"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

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

export default function TermsPage() {
  const [particles, setParticles] = useState<HeartParticle[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setParticles((prev) => prev.filter((p) => now - p.id < 1200));
    }, 150);
    return () => clearInterval(interval);
  }, [particles]);

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current && cardRef.current.contains(e.target as Node)) {
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
    const count = 5 + Math.floor(Math.random() * 3);

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

  return (
    <div
      onClick={handleScreenClick}
      className="min-h-screen w-full relative overflow-x-hidden flex flex-col items-center justify-between p-6 select-none font-comic text-black bg-transparent"
      style={{ cursor: "pointer" }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-100" style={{ zIndex: 0 }} />

      {/* Top-Left Pink Lightning */}
      <div className="absolute top-6 left-6 md:top-12 md:left-16 w-16 h-20 md:w-24 md:h-28 text-zap-pink opacity-85 transform -rotate-12 select-none pointer-events-none transition-transform duration-300 hover:rotate-6 z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" fill="currentColor" stroke="black" strokeWidth="3">
          <polygon points="60,5 20,55 50,55 40,95 80,45 50,45" />
        </svg>
      </div>

      {/* Bottom-Right Mint Star */}
      <div className="absolute bottom-6 right-6 md:bottom-16 md:right-20 w-16 h-16 md:w-24 md:h-24 text-[#C4E8E2] opacity-85 transform rotate-12 select-none pointer-events-none transition-transform duration-300 hover:-rotate-12 z-10">
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]" fill="currentColor" stroke="black" strokeWidth="3.5">
          <polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" />
        </svg>
      </div>

      {/* Floating Hearts Click Particles Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute animate-heart"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              "--rot-start": `${p.rotStart}deg`,
              "--rot-end": `${p.rotEnd}deg`,
              "--wobble-dist": `${p.wobbleDist}px`,
            } as React.CSSProperties}
          >
            <svg viewBox="0 0 24 24" fill={p.color} stroke="black" strokeWidth="2.5" className="w-full h-full filter drop-shadow-[1px_2px_0px_rgba(0,0,0,1)]">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        ))}
      </div>

      {/* Header Section */}
      <div className="flex flex-col items-center mb-6 select-none relative z-10">
        <div className="relative flex flex-col md:flex-row items-center gap-2 md:gap-4">
          <div className="relative">
            <h1 className="font-lilita text-[3.8rem] leading-[0.9] md:text-[5rem] uppercase italic tracking-wider text-zap-purple transform -skew-x-12 select-none">
              TERMS &<br className="hidden md:block" />CONDITIONS
            </h1>
            <h1
              className="absolute inset-0 font-lilita text-[3.8rem] leading-[0.9] md:text-[5rem] uppercase italic tracking-wider text-[#5C5424] transform -skew-x-12 select-none -translate-x-[4px] -translate-y-[4px] pointer-events-none"
              style={{ WebkitTextStroke: "2.5px black" }}
            >
              TERMS &<br className="hidden md:block" />CONDITIONS
            </h1>
          </div>

          <div className="bg-black text-white font-lilita text-xs md:text-sm uppercase py-1.5 px-3.5 border-2 border-white rounded-none shadow-[3px_3px_0px_rgba(0,0,0,1)] transform -rotate-[6deg] md:-rotate-[8deg] mt-3 md:mt-2">
            FAIR PLAY RULES 📜
          </div>
        </div>
      </div>

      {/* Card Wrapper */}
      <div
        ref={cardRef}
        className="w-full max-w-[560px] relative mt-2 mb-8 select-text cursor-default z-20"
      >
        <div className="absolute inset-0 bg-black rounded-sm translate-x-2 translate-y-2 border-[3.5px] border-black"></div>
        <div className="absolute inset-0 bg-white rounded-sm translate-x-1 translate-y-1 border-[3.5px] border-black transform rotate-[0.6deg]"></div>

        <div className="relative bg-white rounded-sm border-[3.5px] border-black transform -rotate-[0.5deg] p-6 md:p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b-[3px] border-black pb-4 select-none">
            <h2 className="font-lilita text-2xl md:text-3xl tracking-wide uppercase flex items-center gap-2">
              <span>⚡</span> SQUAD CODE OF CONDUCT
            </h2>
            <Link
              href="/login"
              className="px-3 py-1.5 bg-zap-yellow text-black border-2 border-black font-lilita text-xs uppercase shadow-[2px_2px_0px_#000] hover:bg-amber-400 active:translate-y-[1px] active:shadow-none transition-all"
            >
              ← BACK TO LOGIN
            </Link>
          </div>

          <div className="flex flex-col gap-5 text-xs md:text-sm font-sans font-semibold leading-relaxed text-black/85">
            <section className="flex flex-col gap-1.5">
              <h3 className="font-lilita text-md md:text-lg text-black uppercase tracking-wider flex items-center gap-1.5">
                <span>1.</span> ACCEPTANCE OF TERMS
              </h3>
              <p>
                By creating an account or accessing ZAP! CHAT, you agree to follow these Terms of Service. If you do not agree to these rules, please discontinue using the application.
              </p>
            </section>

            <section className="flex flex-col gap-1.5">
              <h3 className="font-lilita text-md md:text-lg text-black uppercase tracking-wider flex items-center gap-1.5">
                <span>2.</span> USER CONDUCT & SQUAD ETHICS
              </h3>
              <p>
                Keep the vibes hyped and positive! You agree not to send spam, hate speech, abusive material, or unauthorized advertisements. Respect your squadmates at all times.
              </p>
            </section>

            <section className="flex flex-col gap-1.5">
              <h3 className="font-lilita text-md md:text-lg text-black uppercase tracking-wider flex items-center gap-1.5">
                <span>3.</span> ACCOUNT SECURITY
              </h3>
              <p>
                You are responsible for keeping your email account secure. ZAP! CHAT utilizes passwordless authentication via OTP verification codes sent directly to your email.
              </p>
            </section>

            <section className="flex flex-col gap-1.5">
              <h3 className="font-lilita text-md md:text-lg text-black uppercase tracking-wider flex items-center gap-1.5">
                <span>4.</span> SERVICE AVAILABILITY
              </h3>
              <p>
                We continuously refine and upgrade our messaging infrastructure. While we aim for maximum uptime, ZAP! CHAT is provided as-is without warranties of uninterrupted service.
              </p>
            </section>
          </div>

          <div className="pt-4 border-t-[2.5px] border-black flex justify-between items-center select-none text-[10px] md:text-xs font-lilita uppercase text-black/60">
            <span>ZAP! CHAT TERMS SERVICE</span>
            <span>LAST UPDATED: 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
