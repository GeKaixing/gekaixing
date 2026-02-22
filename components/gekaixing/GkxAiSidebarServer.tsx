"use server"

import { createClient } from "@/utils/supabase/server";
import GkxAiSidebar from "./GkxAiSidebar";
import { prisma } from "@/lib/prisma";

export default async function GkxAiSidebarServer() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // 获取历史会话
    const sessions = await prisma.chatAISession.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
    });

    return (
        < GkxAiSidebar sessions={sessions} userId={user.id}></GkxAiSidebar >
    )
}
