import { cn } from "@/lib/cn";

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

/** Square pink chip used for unread counts and nav highlights. */
export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "grid size-8 place-items-center rounded-lg bg-brand-pink text-sm font-extrabold text-ink ink-border ink-shadow-sm",
        className
      )}
    >
      {children}
    </span>
  );
}
