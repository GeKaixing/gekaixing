import ChatUI from "@/components/gekaixing/ChatUI"
import { createClient } from "@/utils/supabase/server";

export default async function Page({
  params,
}: {
  params: { sessionId: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser();
  const { sessionId } = await params
  if (!user) return null;
  return <ChatUI sessionId={sessionId} userId={user.id} />
}