import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  if (id) {
    if (type === "user_id") {
      const { data, error } = await supabase
        .from("post_with_top_reply_count")
        .select("*")
        .order("created_at", { ascending: false }) // 按时间倒序，最新的在前
        .eq(type, id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ data: data, success: true });
    }
    const { data, error } = await supabase
      .from("post_with_top_reply_count")
      .select("*")
      .order("created_at", { ascending: false }) // 按时间倒序，最新的在前
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data: data, success: true });
  } else {
    const { data, error } = await supabase
      .from("post_with_top_reply_count")
      .select("*")
      .order("created_at", { ascending: false }); // 按时间倒序，最新的在前
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data, success: true });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { user_id, user_name, user_email, content, user_avatar } =
    await request.json();
  const { data, error } = await supabase
    .from("post")
    .insert([{ user_id, user_name, user_email, content, user_avatar }])
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  return NextResponse.json({ data: data, success: true });
}
export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { id } = await request.json();
  const { data, error } = await supabase.from("post").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  revalidateTag("imitation-x");
  return NextResponse.json({ data: data, success: true });
}
