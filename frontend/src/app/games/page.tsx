import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { currentUser } from "@/lib/mock-data";

export default function GamesPage() {
  return (
    <AppShell user={currentUser} sidebar={<PlaceholderScreen title="Games" emoji="🎮" />}>
      <EmptyState emoji="🎮" title="Games" description="Play with your friends here" />
    </AppShell>
  );
}
