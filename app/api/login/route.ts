// app/api/login/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { email, password } = await request.json();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log(error);
  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 },
    );
  }

  return NextResponse.json({ success: true, user: data.user });
}
