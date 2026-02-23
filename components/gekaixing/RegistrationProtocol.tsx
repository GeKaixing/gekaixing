import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export default async function RegistrationProtocol() {
    const t = await getTranslations('Account.RegistrationProtocol')

    return (
        <div className='w-2xs max-w-2xs text-[11px] text-muted-foreground break-words whitespace-normal'>
            <Link
                href={'/account/signup'}
                className='mb-4 flex h-9 w-2xs items-center justify-center rounded-2xl bg-primary text-primary-foreground transition-opacity hover:opacity-90'
            >
                {t('createAccount')}
            </Link>
            <p className='leading-relaxed'>
                {t('agreementPrefix')}
                <Link href={'/tos'} className='text-primary underline'>
                    {t('termsOfService')}
                </Link>
                {t('and')}
                <Link href={'/privacy'} className='text-primary underline'>
                    {t('privacyPolicy')}
                </Link>
                ,
                {t('including')}
                <Link href={'/cookies'} className='text-primary underline'>
                    {t('cookiePolicy')}
                </Link>
            </p>
        </div>
    )
}
