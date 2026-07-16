import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export function Input({ label, icon, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="font-lilita text-xs tracking-wider uppercase text-black/70 select-none">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          className={cn(
            "w-full bg-white text-black font-semibold placeholder-black/40 border-[3px] border-black px-4 py-3 rounded-sm shadow-[4px_4px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-amber-50 focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all",
            icon && "pr-11",
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/50 pointer-events-none w-5 h-5 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
