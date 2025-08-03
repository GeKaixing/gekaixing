import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { user_id, user_name, user_email, content, user_avatar } = await request.json()
    const { data, error } = await supabase
        .from('post')
        .insert([
            { user_id, user_name, user_email, content, user_avatar },
        ])
        .select()
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({ data: data, success: true })
}