
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
import Button from '@/components/towel/Button'
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
    const [open, setOpen] = useState(true)
    const [openAlertDialog, setOpenAlertDialog] = useState(false)
    const router = useRouter()
    const [email, setEmail] = useState('')

    useEffect(() => {
        if (open === false) {
            router.replace('/account')
        }
    }, [open])

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
                    <DialogTitle>查找你的 towel 账户
                        <div className='text-gray-800 text-[12px] mt-4 mb-6'> 输入与你的账户关联的电子邮件。</div>
                    </DialogTitle>
                    <DialogDescription className='flex flex-col justify-center items-center gap-6'>
                        <Input type='email' placeholder="请输入邮箱" value={email} onChange={(e) => { setEmail(e.target.value) }} ></Input>
                        <Button
                            onClick={password_reset}
                        >发送验证码</Button>
                        <EnterMsmAlertDialog open={openAlertDialog} setOpen={setOpenAlertDialog} />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

function EnterMsmAlertDialog({
    open,
    setOpen
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {/* <Button className='bg-blue-500 text-white'>Open Alert</Button> */}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>确认邮件已经发送道你的邮箱</AlertDialogTitle>
                    <AlertDialogDescription>
                        请前往邮箱点击连接确认是否本人操作
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction>确认</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}