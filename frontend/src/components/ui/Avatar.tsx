import React from "react";
import { cn } from "../../lib/utils";

interface AvatarProps {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
  shape?: "circle" | "square";
  borderColor?: string;
  className?: string;
}

export function Avatar({
  name,
  color = "var(--color-zap-purple)",
  size = "md",
  isOnline = false,
  shape = "circle",
  borderColor,
  className,
}: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: "w-8 h-8 text-xs border-2 shadow-[1px_1.5px_0px_#000]",
    md: "w-11 h-11 text-sm border-[2.5px] shadow-[2px_2.5px_0px_#000]",
    lg: "w-16 h-16 text-lg border-[3.5px] shadow-[3px_4px_0px_#000]",
  };

  const statusDotSizes = {
    sm: "w-2.5 h-2.5 border-1.5",
    md: "w-3.5 h-3.5 border-2",
    lg: "w-4.5 h-4.5 border-2.5",
  };

  const borderStyle = borderColor
    ? { borderColor }
    : {};

  return (
    <div className="relative flex-shrink-0 select-none">
      <div
        className={cn(
          "font-lilita flex items-center justify-center text-black border-black",
          shape === "circle" ? "rounded-full" : "rounded-[10px]",
          sizeClasses[size],
          className
        )}
        style={{ 
          backgroundColor: color,
          ...borderStyle
        }}
      >
        {initials}
      </div>

      {isOnline && shape === "circle" && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full bg-[#4CD964] border-black",
            statusDotSizes[size]
          )}
        />
      )}
    </div>
  );
}
