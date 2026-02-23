
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
import Button from '@/components/gekaixing/Button'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useTranslations } from 'next-intl'
async function PasswordResetFetch(email: string) {
    const result = await fetch('/api/password_reset', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return result

}


export default function Password_resetDialog() {
    const t = useTranslations('Account.PasswordResetDialog')
    const [open, setOpen] = useState(true)
    const [openAlertDialog, setOpenAlertDialog] = useState(false)
    const router = useRouter()
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (open === false) {
            router.replace('/account')
        }
    }, [open, router])

    async function password_reset() {

        const result = await PasswordResetFetch(email)
        const data = await result.json()
        if (data.success) {
            setOpenAlertDialog(true);
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}  >
            <DialogTrigger asChild>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title')}
                        <div className='text-gray-800 text-[12px] mt-4 mb-6'>{t('description')}</div>
                    </DialogTitle>
                    <DialogDescription className='flex flex-col justify-center items-center gap-6'>
                        <Input type='email' placeholder={t('emailPlaceholder')} value={email} onChange={(e) => { setEmail(e.target.value) }} ></Input>
                        <Button
                            onClick={password_reset}
                        >{t('sendCode')}</Button>
                        <EnterMsmAlertDialog open={openAlertDialog} setOpen={setOpenAlertDialog} t={t} />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

function EnterMsmAlertDialog({
    open,
    setOpen,
    t,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    t: ReturnType<typeof useTranslations>;
}) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {/* <Button className='bg-blue-500 text-white'>Open Alert</Button> */}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('dialog.title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('dialog.description')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('dialog.cancel')}</AlertDialogCancel>
                    <AlertDialogAction>{t('dialog.confirm')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
