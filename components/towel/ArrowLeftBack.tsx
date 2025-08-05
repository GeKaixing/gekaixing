"use client"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ArrowLeftBack({className}:{className?:string}) {
    const router = useRouter()
    return (
        <ArrowLeft 
        className={className}
        onClick={() => {
            router.back()
        }} />
    )
}
