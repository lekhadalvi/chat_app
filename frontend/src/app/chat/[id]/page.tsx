import { notFound } from "next/navigation";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { HomeScreen } from "@/components/home/HomeScreen";
import { AppShell } from "@/components/layout/AppShell";
import { chats, currentUser, stories } from "@/lib/mock-data";

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chat = chats.find((c) => c.id === id);
  if (!chat) notFound();

  return (
    <AppShell
      user={currentUser}
      sidebar={<HomeScreen stories={stories} chats={chats} />}
      mobilePane="main"
    >
      <ChatRoom chat={chat} />
    </AppShell>
  );
}
