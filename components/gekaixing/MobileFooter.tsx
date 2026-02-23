 "use client"
import { House, Search, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'

export default function MobileFooter({id}:{id:string|undefined}) {
    const t = useTranslations("ImitationX.Mobile")
    return (
        <div className='sm:hidden fixed bottom-0 w-full flex flex-row px-6 py-2 shadow bg-background/95 backdrop-blur border-t border-border'>
            <ul className='w-full flex items-center justify-around'>
                <Link href={'/imitation-x'} data-value={t("home")}><House /></Link>
                <Link href={'/imitation-x/explore'} data-value={t("search")}> <Search></Search></Link>
                <Link href={`/imitation-x/user/${id}`} data-value={t("mine")}><User></User></Link>
            </ul>
        </div>
    )
}
