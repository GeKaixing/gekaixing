import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('news-sports')
        .select('*')
        .order('created_at', { ascending: false })  // 按时间倒序，最新的在前
        .limit(20);                                 // 限制为 20 条

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ data: data, success: true })
}