import { cn } from "@/lib/cn";

export interface EmptyStateProps {
  emoji: string;
  title: string;
  description?: string;
  className?: string;
}

/** Fills a whole pane — used for the detail pane when nothing is selected. */
export function EmptyState({ emoji, title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-surface p-10 text-center ink-border ink-shadow",
        className
      )}
    >
      <span className="text-5xl" aria-hidden="true">
        {emoji}
      </span>
      <h2 className="text-lg font-black tracking-wide text-ink uppercase">{title}</h2>
      {description && (
        <p className="max-w-xs text-xs font-bold tracking-wider text-muted uppercase">
          {description}
        </p>
      )}
    </div>
  );
}
