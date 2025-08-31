import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = '/imitation-x'
    //   // Create redirect link without the secret token
    const redirectTo = request.nextUrl.clone()
    redirectTo.pathname = next
    redirectTo.searchParams.delete('code')
    //   redirectTo.searchParams.delete('type')
    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            redirectTo.searchParams.delete('next')
            return NextResponse.redirect(redirectTo)
        }
    }
    // return the user to an error page with some instructions
    redirectTo.pathname = '/error'
    return NextResponse.redirect(redirectTo)
}