import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { currentUser } from "@/lib/mock-data";

export default function FriendsPage() {
  return (
    <AppShell user={currentUser} sidebar={<PlaceholderScreen title="Friends" emoji="👥" />}>
      <EmptyState emoji="👥" title="Friends" description="Your people will show up here" />
    </AppShell>
  );
}
