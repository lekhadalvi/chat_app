import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";
import { currentUser } from "@/lib/mock-data";

export default function ProfilePage() {
  return (
    <AppShell user={currentUser} sidebar={<PlaceholderScreen title="You" emoji="🙂" />}>
      <EmptyState emoji="🙂" title="Your profile" description="Settings and vibes go here" />
    </AppShell>
  );
}
