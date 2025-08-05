import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { email } = await request.json()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: '  process.env.NEXT_PUBLIC_URL/auth/update_password',
  }
  )

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  return NextResponse.json({ success: true })
}