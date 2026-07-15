import { Card } from "@/components/ui/Card";

export interface PlaceholderScreenProps {
  title: string;
  emoji: string;
}

/** Stub body for tabs that aren't built yet. */
export function PlaceholderScreen({ title, emoji }: PlaceholderScreenProps) {
  return (
    <Card className="grid place-items-center gap-2 p-10 text-center">
      <span className="text-4xl" aria-hidden="true">
        {emoji}
      </span>
      <h2 className="text-lg font-black tracking-wide text-ink uppercase">{title}</h2>
      <p className="text-xs font-bold tracking-wider text-muted uppercase">Coming soon</p>
    </Card>
  );
}
