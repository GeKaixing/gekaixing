"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import Link from 'next/link'
import { Button } from '../ui/button'

export default function CookieConsent() {
    const [cookieConsent, setCookieConsent] = useState(false)
    useEffect(() => {
        const data = localStorage.getItem('CookieConsent')
        if (data) {
            setCookieConsent(true)
        } else {
            setCookieConsent(false)
        }
    }, [])
    return (
        cookieConsent && <Card className='bg-black border-black fixed bottom-6 
            sm:max-w-[400px] sm:right-6 '>
            <CardContent className='bg-black text-white'>
                This website uses cookies to ensure you get the best experience on our website.
                <Link href={'/cookies'} className='underline'>
                    Cookies Policy
                </Link>
            </CardContent>
            <CardFooter>
                <Button className='h-9 bg-white text-black hover:bg-gray-500 hover:text-white '
                    onClick={() => {
                        localStorage.setItem('CookieConsent','true')
                    }}
                >GOT IT</Button>
            </CardFooter>
        </Card>
    )
}
