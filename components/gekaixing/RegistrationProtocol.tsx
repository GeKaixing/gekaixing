import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export default async function RegistrationProtocol() {
    const t = await getTranslations('Account.RegistrationProtocol')
    return (
        <div className='text-[11px] text-muted-foreground'>
            <Link href={'/account/signup'} className='h-9 rounded-2xl flex justify-center items-center w-2xs bg-primary text-primary-foreground mb-4 hover:opacity-90 transition-opacity'>{t('createAccount')}</Link>
            {t('agreementPrefix')}
            <Link href={'/tos'} className='underline text-primary'>{t('termsOfService')}
            </Link>{t('and')}
            <Link href={'/privacy'} className='underline text-primary'>{t('privacyPolicy')}
            </Link>
            ,
            <p>
                {t('including')}
                <Link href={'/gekaixing-cookies'} className='underline text-primary'>
                    {t('cookiePolicy')}
                </Link>
            </p>

        </div>
    )
}
