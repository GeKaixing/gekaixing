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
      return NextResponse.json(
        { error: error?.message ?? "Signup failed" },
        { status: 401 }
      );
    }

    // ✅ 用 id 做 upsert（最安全）
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: {
        // 如果未来想更新 name / avatar 可以写这里
      },
      create: {
        id: data.user.id,
        userid: `user_${data.user.id.slice(0, 8)}`,
        email,
        name: name ?? "anonymity",
        avatar: avatar ?? null,
      },
    });

    return NextResponse.json({ success: true });

  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}