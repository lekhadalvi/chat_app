import { Plus } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/cn";
import type { Story } from "@/types";

export interface StoryRailProps {
  stories: Story[];
}

export function StoryRail({ stories }: StoryRailProps) {
  return (
    <section
      aria-label="Stories"
      className="rounded-2xl bg-surface p-3 ink-border ink-shadow"
    >
      <ul className="flex items-start gap-3 overflow-x-auto">
        <li className="flex shrink-0 flex-col items-center gap-1.5">
          <button
            type="button"
            aria-label="Add your story"
            className="grid size-12 place-items-center rounded-xl bg-[#e8e4d8] ink-border ink-shadow-sm"
          >
            <Plus className="size-5 text-ink" strokeWidth={3} />
          </button>
          <span className="text-[10px] font-black tracking-wider text-muted uppercase">
            You
          </span>
        </li>

        {stories.map(({ id, user, seen }) => (
          <li key={id} className="flex shrink-0 flex-col items-center gap-1.5">
            <button type="button" aria-label={`View ${user.name}'s story`}>
              <span
                className={cn(
                  "block rounded-xl p-0.5 ink-border ink-shadow-sm",
                  seen ? "bg-[#e8e4d8]" : "bg-brand-pink"
                )}
              >
                <Avatar
                  emoji={user.emoji}
                  tone={user.tone}
                  imageUrl={user.imageUrl}
                  alt={user.name}
                  size="sm"
                  className="rounded-lg border-2"
                />
              </span>
            </button>
            <span className="text-[10px] font-black tracking-wider text-ink uppercase">
              {user.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
