
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
async function update_passwordFetch(password: string) {
    const result = await fetch('/account/update_password', {
        method: 'POST',
        body: JSON.stringify({
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    )
    return result
}
export default function Update_passwordDialog() {
    const [open, setOpen] = useState(true)
    const [password, setPassword] = useState('')
    const router = useRouter()

    useEffect(() => {
        if (open === false) {
            router.replace('/account')
        }
    }, [open, router])

    async function update_password() {
        const result = await update_passwordFetch(password)
        if(result.ok){
            router.replace('/account/login')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}  >
            <DialogTrigger asChild>

            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>更新你的密码</DialogTitle>
                    <DialogDescription>输入你的新密码</DialogDescription>
                </DialogHeader>
                <div className='mx-auto flex w-full max-w-sm flex-col items-stretch gap-4'>
                    <Input type='password' placeholder="请新密码" value={password} onChange={(e) => setPassword(e.target.value)}></Input>
                    <Button className='w-full'
                        onClick={ update_password}
                    >确认</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
