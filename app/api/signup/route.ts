import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { email, password, name, avatar } = await request.json();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/confirm`,
      },
    });

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message }, { status: 401 });
    }

    // ✅ 同步写入 Prisma User 表（用 Supabase user.id）
    await prisma.user.create({
      data: {
        id: data.user.id,
        userid: `user_${data.user.id.slice(0, 8)}`,
        email,
        name: name ?? "anonymity",
        avatar: avatar ?? null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e)
  }
}
