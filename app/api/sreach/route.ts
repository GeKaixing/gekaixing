import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || ""; // 用户输入关键词
    console.log(query)
  if (!query.trim()) {
    return NextResponse.json({ data: [], success: true, message: "Empty query" });
  }

  // 使用 ilike 进行不区分大小写模糊搜索
  const { data, error } = await supabase
    .from("post")
    .select("*")
    .or(`user_name.ilike.%${query}%,content.ilike.%${query}%`); // 搜索 title 或 content 包含 query 的内容

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, success: true });
}
