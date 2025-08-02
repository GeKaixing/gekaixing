"use client"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ArrowLeftBack() {
    const router = useRouter()
    return (
        <ArrowLeft onClick={() => {
            router.back()
        }} />
    )
}
