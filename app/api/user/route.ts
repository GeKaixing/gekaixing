import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { createClient as createClientROLE } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient()
  
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const prismaUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { userid: true },
    })

    return NextResponse.json({ 
      userid: prismaUser?.userid || null,
      success: true 
    })
  } catch (error) {
    console.error('Failed to fetch userid:', error)
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const body = await request.json()

  const { name, user_background_image, user_avatar, brief_introduction, userid } = body

  // 1. 获取当前登录用户
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. 构建要更新的字段对象（只包含传入的字段）
  const updateData: Record<string, string> = {}
  if (name) updateData.name = name
  if (user_background_image) updateData.user_background_image = user_background_image
  if (user_avatar) updateData.user_avatar = user_avatar
  if (brief_introduction) updateData.brief_introduction = brief_introduction

  // 3. 更新 Prisma 中的 userid（如果提供）
  if (userid) {
    try {
      // 检查 userid 是否已被其他用户使用
      const existingUser = await prisma.user.findUnique({
        where: { userid },
      })
      
      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json({ error: '该用户ID已被使用' }, { status: 400 })
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { userid },
      })
    } catch (error) {
      console.error('Failed to update userid:', error)
      return NextResponse.json({ error: '更新用户ID失败' }, { status: 500 })
    }
  }

  // 4. 没有任何字段要更新
  if (Object.keys(updateData).length === 0 && !userid) {
    return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 })
  }

  // 5. 更新 Supabase Auth 用户
  const { data, error } = await supabase.auth.updateUser({
    data: updateData,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ data, success: true })
}


export async function DELETE(req: Request) {
  const supabaseAdmin = createClientROLE(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // 你的 Supabase URL
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE! // ❗必须是 service_role key
  );
  const body = await req.json();
  const { userId } = body;

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);


  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
