import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    user_id,
    user_name,
    user_email,
    content,
    user_avatar,
    post_id,
    reply_id,
  } = await request.json();
  const { data, error } = await supabase
    .from("reply")
    .insert([
      {
        user_id,
        user_name,
        user_email,
        content,
        user_avatar,
        post_id,
        reply_id,
      },
    ])
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  revalidateTag(`reply:post_id:${post_id}`);
  return NextResponse.json({ data: data, success: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { id } = await request.json();
  const { data, error } = await supabase.from("reply").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({ data: data, success: true });
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id"); // <-- 这里获取了查询参数
  const type = searchParams.get("type") as string;
  
  if (id) {
    if (type === "post_id") {
      const { data, error } = await supabase
        .from("reply_with_reply_count")
        .select("*")
        .eq(type, id) // 比如 .eq('post_id', 某帖子ID)
        .eq("reply_id", 0); // ✅ 只保留 reply_id 为 0 的数据
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ data: data, success: true });
    } else if (type === "reply_id") {
      const { data, error } = await supabase
        .from("reply_with_reply_count")
        .select("*")
        .eq(type, id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ data: data, success: true });
    } else if (type === "id") {
      const { data, error } = await supabase
        .from("reply_with_reply_count")
        .select("*")
        .eq(type, id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ data: data, success: true });
    }
  } else {
    const { data, error } = await supabase.from("reply").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data, success: true });
  }
}
