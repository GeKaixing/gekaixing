import GoogleButton from '@/components/gekaixing/GoogleButton'
import { LoginFooter } from '@/components/gekaixing/LoginFooter'
import RegistrationProtocol from '@/components/gekaixing/RegistrationProtocol'
import { Separator } from '@/components/ui/separator'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default async function layout({ children }: { children: React.ReactNode }) {
    const t = await getTranslations('Account.Layout')

    return (
        <div className='min-h-screen bg-background text-foreground'>

            <div className="fixed inset-0 flex justify-center items-center min-h-screen ">
                <div className='flex gap-80 justify-center items-center'>
                    <>
                        <Image className='max-sm:hidden dark:hidden' src='/logo.svg' alt="Gekaixing logo" width={200} height={200}></Image>
                        <Image className='max-sm:hidden hidden dark:block' src='/logo-white.svg' alt="Gekaixing logo white" width={200} height={200}></Image>
                    </>
                    <div className='flex flex-col justify-center items-center gap-6 '>
                        <GoogleButton></GoogleButton>
                        <Separator />
                        <RegistrationProtocol />
                        <strong className='mt-6 text-sm text-foreground'>{t('alreadyHaveAccount')}</strong>
                        <Link href={'/account/login'} className='h-9 border border-border rounded-2xl flex justify-center items-center w-2xs text-primary hover:bg-muted transition-colors'>{t('login')}</Link>
                        <Link href={'/account/password_reset'} className='h-9 border border-border rounded-2xl flex justify-center items-center w-2xs text-foreground hover:bg-muted transition-colors'>{t('forgotPassword')}</Link>
                    </div>
                </div>
            </div>
            <LoginFooter></LoginFooter>
            {children}
        </div>
    )
}
