 "use client"
import { House, Search, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

type MobileFooterTranslations = {
    home: string
    search: string
    mine: string
}

export default function MobileFooter({
    id,
    labels,
}: {
    id: string | undefined
    labels: MobileFooterTranslations
}) {
    return (
        <div className='sm:hidden fixed bottom-0 w-full flex flex-row px-6 py-2 shadow bg-background/95 backdrop-blur border-t border-border'>
            <ul className='w-full flex items-center justify-around'>
                <Link href={'/gekaixing'} data-value={labels.home}><House /></Link>
                <Link href={'/gekaixing/explore'} data-value={labels.search}> <Search></Search></Link>
                <Link href={`/gekaixing/user/${id}`} data-value={labels.mine}><User></User></Link>
            </ul>
        </div>
    )
}
