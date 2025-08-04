import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
     const { data, error } = await supabase
      .from("post_with_top_reply_count")
      .select("*")
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data: data, success: true });
  } else {
    const { data, error } = await supabase
      .from("post_with_top_reply_count")
      .select("*");
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

  return NextResponse.json({ data: data, success: true });
}
