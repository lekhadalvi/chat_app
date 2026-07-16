import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "purple" | "yellow" | "pink" | "cyan" | "white";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "white",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-lilita uppercase border-[3px] border-black rounded-sm cursor-pointer select-none transition-all active:shadow-none";

  const variants = {
    white:
      "bg-white text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]",
    purple:
      "bg-zap-purple text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] disabled:bg-purple-900/50",
    yellow:
      "bg-zap-yellow text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]",
    pink:
      "bg-zap-pink text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]",
    cyan:
      "bg-zap-cyan text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs md:text-sm shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]",
    md: "px-5 py-2.5 text-sm md:text-md",
    lg: "px-7 py-3.5 text-lg md:text-xl shadow-[5px_5px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px]",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
