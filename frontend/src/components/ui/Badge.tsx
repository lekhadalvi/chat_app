import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "black" | "purple" | "yellow" | "pink" | "cyan";
  slanted?: boolean;
}

export function Badge({
  children,
  variant = "black",
  slanted = true,
  className,
  ...props
}: BadgeProps) {
  const bgColors = {
    black: "bg-black text-white border-white",
    purple: "bg-zap-purple text-white border-black",
    yellow: "bg-zap-yellow text-black border-black",
    pink: "bg-zap-pink text-black border-black",
    cyan: "bg-zap-cyan text-black border-black",
  };

  return (
    <div
      className={cn(
        "font-lilita text-xs md:text-sm uppercase py-1 px-3 border-2 shadow-[2px_2px_0px_rgba(0,0,0,1)] select-none",
        slanted && "transform -rotate-[6deg] hover:rotate-3 transition-transform duration-200",
        bgColors[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
