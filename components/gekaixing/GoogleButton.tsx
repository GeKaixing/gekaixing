"use client"
import React from 'react'
import Button from './Button'
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'

export default function GoogleButton() {

    async function google_login() {
        const supabase = createClient()
        const { data } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_URL}/auth/callback`,
            },
        })
        if (data.url) {
            redirect(data.url) // use the redirect API for your server framework
        }
    }

    return (
        <Button className='mb-6' onClick={google_login}>使用Google账号登录</Button>
    )
}
