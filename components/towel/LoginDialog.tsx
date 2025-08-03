'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Button from '@/components/towel/Button'
import { Separator } from '@/components/ui/separator'
import LoginForm from "./LoginForm"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginDialog() {
    const [open, setOpen] = useState(true)
    const router=useRouter()

    useEffect(() => {
        if (open === false) {
            router.replace('/account')
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={setOpen}  >
            <DialogTrigger asChild >

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>登入Towel</DialogTitle>
                    <DialogDescription className='flex flex-col justify-center items-center'>
                        <Button className='text-black my-6'>使用Google账号登录</Button>
                        <Separator className='mb-6' />
                        <LoginForm></LoginForm>
                        <Button className='text-black mt-6' onClick={()=>{router.push('/account/password_reset')}}>忘记密码</Button>
                        <span className='mt-4'>还没有账户吗?
                            <Link href={'/account/signup'} className='text-blue-500 '>注册</Link>
                        </span>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}