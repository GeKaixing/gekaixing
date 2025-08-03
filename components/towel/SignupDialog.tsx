'use client'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import SignupForm from '@/components/towel/SignupForm'
import Button from '@/components/towel/Button'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import GoogleButton from './GoogleButton'


export default function SignupDialog() {
    const [open, setOpen] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (open === false) {
            router.replace('/account')
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}  >
            <DialogTrigger asChild>

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>注册Towel</DialogTitle>
                    <DialogDescription className='flex flex-col justify-center items-center'>
                        <GoogleButton></GoogleButton>
                        <Separator className='mb-6' />
                        <SignupForm></SignupForm>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}