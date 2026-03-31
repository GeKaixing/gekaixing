import ChatUI from "@/components/gekaixing/ChatUI";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return <ChatUI userId={user.id} />;
}