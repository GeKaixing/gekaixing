'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Button from '@/components/gekaixing/Button'
import { Separator } from '@/components/ui/separator'
import LoginForm from "./LoginForm"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import GoogleButton from "./GoogleButton"
import { useTranslations } from "next-intl"

export default function LoginDialog() {
    const t = useTranslations('Account.LoginDialog')
    const [open, setOpen] = useState(true)
    const router = useRouter()

   
    useEffect(() => {
        if (open === false) {
            router.replace('/account')
        }
    }, [open, router])

    return (
        <Dialog open={open} onOpenChange={setOpen}  >
            <DialogTrigger asChild >

            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription className='sr-only'>{t('title')}</DialogDescription>
                </DialogHeader>
                <div className='mx-auto flex w-full max-w-sm flex-col items-stretch'>
                    <GoogleButton></GoogleButton>
                    <Separator className='mb-6 mt-4' />
                    <LoginForm></LoginForm>
                    <Button className='mt-6 w-full' onClick={() => { router.push('/account/password_reset') }}>{t('forgotPassword')}</Button>
                    <span className='mt-4 text-center text-sm'>{t('noAccount')}
                        <Link href={'/account/signup'} className='text-blue-500 '>{t('signup')}</Link>
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    )
}
