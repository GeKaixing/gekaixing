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
import SignupForm from '@/components/gekaixing/SignupForm'
import { Separator } from '@/components/ui/separator'
import { useRouter } from 'next/navigation'
import GoogleButton from './GoogleButton'
import { useTranslations } from 'next-intl'


export default function SignupDialog() {
    const t = useTranslations('Account.SignupDialog')
    const [open, setOpen] = useState(true)
    const router = useRouter()
    
    useEffect(() => {
        if (open === false) {
            router.replace('/account')
        }
    }, [open, router])

    return (
        <Dialog open={open} onOpenChange={setOpen}  >
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                    <DialogDescription className='sr-only'>{t("title")}</DialogDescription>
                </DialogHeader>
                <div className='mx-auto flex w-full max-w-sm flex-col items-stretch'>
                    <GoogleButton></GoogleButton>
                    <Separator className='mb-6 mt-4' />
                    <SignupForm></SignupForm>
                </div>
            </DialogContent>
        </Dialog>
    )
}
