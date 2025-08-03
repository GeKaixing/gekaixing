import Link from 'next/link'
import React from 'react'
import SignupDialogForm from './SignupDialog'


export default function RegistrationProtocol() {
    return (
        <div className='text-[11px] text-gray-500 '>
            <Link  href={'/account/signup'} className='h-9 border border-gray-300 rounded-2xl flex justify-center items-center w-2xs bg-blue-500 text-white mb-4'>建立你的账户</Link>
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