import { HomeScreen } from "@/components/home/HomeScreen";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { chats, currentUser, stories } from "@/lib/mock-data";

export default function Home() {
  return (
    <AppShell user={currentUser} sidebar={<HomeScreen stories={stories} chats={chats} />}>
      <EmptyState
        emoji="👋"
        title="Pick a chat"
        description="Choose a conversation to start yapping"
      />
    </AppShell>
  );
}
