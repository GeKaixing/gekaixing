import Link from 'next/link'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import LoginForm from '../../components/towel/LoginForm'
import Image from 'next/image'
import SignupForm from '@/components/towel/SignupForm'
import Button from '@/components/towel/Button'
import { Input } from '@/components/ui/input'
import { LoginFooter } from '@/components/towel/LoginFooter'
import { Separator } from '@/components/ui/separator'

export default function page() {
    return (
        <>
            <div className="fixed inset-0 flex justify-center items-center min-h-screen ">
                <div className='flex gap-80 justify-center items-center'>
                    <Image src='/logo.png' alt="Towel logo" width={200} height={200}></Image>
                    <div className='flex flex-col justify-center items-center gap-6'>
                        <Button className='text-black '>使用Google账号登录</Button>
                        <Separator />
                        <RegistrationProtocol />
                        <strong className='mt-6'>已经有账户了吗？</strong>
                        <LoginDialogButton />
                        <Password_resetDialogButton></Password_resetDialogButton>
                    </div>
                </div>
            </div>
            <LoginFooter></LoginFooter>
        </>

    )
}

function RegistrationProtocol() {
    return (
        <div className='text-[11px] text-gray-500 '>
            <SignupDialogForm></SignupDialogForm>
            如果注册，即表示你同意
            <Link href={'/tos'} className='underline text-blue-500'>服务条款
            </Link>和
            <Link href={'/privacy'} className='underline text-blue-500'>隐私政策
            </Link>
            ,
            <p>
                包括
                <Link href={'/towel-cookies'} className='underline text-blue-500'>
                    Cookie 使用政策。
                </Link>
            </p>

        </div>
    )
}



function SignupDialogForm() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='bg-blue-500 text-white mb-4'>建立你的账户</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>注册Towel</DialogTitle>
                    <DialogDescription className='flex flex-col justify-center items-center'>
                        <Button className='text-black my-6'>使用Google账号登录</Button>
                        <Separator className='mb-6' />
                        <SignupForm></SignupForm>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}


function LoginDialogButton() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='text-blue-500'>登入</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>登入Towel</DialogTitle>
                    <DialogDescription className='flex flex-col justify-center items-center'>
                        <Button className='text-black my-6'>使用Google账号登录</Button>
                        <Separator className='mb-6' />
                        <LoginForm></LoginForm>
                        <Button className='text-black mt-6'>忘记密码</Button>
                        <span className='mt-4'>还没有账户吗?
                            <Link href={'/signup'} className='text-blue-500 '>注册</Link>
                        </span>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
function Password_resetDialogButton() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button >忘记密码</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>查找你的 X 账户
                        <div className='text-gray-800 text-[12px] mt-4 mb-6'> 输入与你的账户关联的电子邮件。</div>
                    </DialogTitle>
                    <DialogDescription className='flex flex-col justify-center items-center gap-6'>
                        <Input type='email' placeholder="请输入邮箱" ></Input>
                        <Button className=''
                        >发送验证码</Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

