import Link from 'next/link'
import { useTranslations } from 'next-intl'


export default function Ablout() {
    const t = useTranslations('FooterLinks')

    return (
        <div className='w-full flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground'>
            <Link href={'/about'} className='whitespace-nowrap hover:underline'>{t('about')}</Link>
            <Link href={'/tos'} className='whitespace-nowrap hover:underline'>{t('termsOfService')}</Link>
            <Link href={'/privacy'} className='whitespace-nowrap hover:underline'>{t('privacyPolicy')}</Link>
            <Link href={'/imitation-x/help'} className='whitespace-nowrap hover:underline'>{t('helpCenter')}</Link>
            <Link href={'/cookies'} className='whitespace-nowrap hover:underline'>{t('cookiePolicy')}</Link>
            <Link href={'https://github.com/GeKaixing/gekaixing'} className='whitespace-nowrap hover:underline'>{t('github')}</Link>
        </div>
    )
}