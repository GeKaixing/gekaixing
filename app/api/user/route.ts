import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { name, user_background_image, user_avatar } = await request.json();

  // 可选：检查当前用户
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (name) {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        name,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, success: true });
  } else if (user_background_image) {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        user_background_image: user_background_image,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, success: true });
  } else if (user_avatar) {
    const { data, error } = await supabase.auth.updateUser({
      data: {
        user_avatar: user_avatar,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data, success: true });
  }
}
