import Button from '@/components/towel/Button'
import GoogleButton from '@/components/towel/GoogleButton'
import { LoginFooter } from '@/components/towel/LoginFooter'
import Password_resetDialog from '@/components/towel/Password_resetDialog'
import RegistrationProtocol from '@/components/towel/RegistrationProtocol'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div>

            <div className="fixed inset-0 flex justify-center items-center min-h-screen ">
                <div className='flex gap-80 justify-center items-center'>
                    <Image src='/logo.png' alt="Towel logo" width={200} height={200}></Image>
                    <div className='flex flex-col justify-center items-center gap-6'>
                        <GoogleButton></GoogleButton>
                        <Separator />
                        <RegistrationProtocol />
                        <strong className='mt-6'>已经有账户了吗？</strong>
                        <Link href={'/account/login'} className='h-9 border border-gray-300 rounded-2xl flex justify-center items-center w-2xs text-blue-500'>登入</Link>
                        <Link href={'/account/password_reset'} className='h-9 border border-gray-300 rounded-2xl flex justify-center items-center w-2xs'>忘记密码</Link>
                    </div>
                </div>
            </div>
            <LoginFooter></LoginFooter>
            {children}
        </div>
    )
}
