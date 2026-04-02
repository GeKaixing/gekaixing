 "use client"
import { House, Search, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils'

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
    const pathname = usePathname()
    const mineHref = id ? `/gekaixing/user/${id}` : "/account"
    const isHome = pathname === "/gekaixing"
    const isExplore = pathname === "/gekaixing/explore"
    const isMine = pathname === mineHref || pathname.startsWith(`${mineHref}/`)

    return (
        <div className='sm:hidden fixed bottom-0 w-full flex flex-row px-6 py-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow bg-background/95 backdrop-blur border-t border-border'>
            <ul className='w-full flex items-center justify-around'>
                <Link
                    href={'/gekaixing'}
                    data-value={labels.home}
                    className={cn("rounded-full p-2 transition-colors", isHome && "bg-muted text-primary")}
                >
                    <House />
                </Link>
                <Link
                    href={'/gekaixing/explore'}
                    data-value={labels.search}
                    className={cn("rounded-full p-2 transition-colors", isExplore && "bg-muted text-primary")}
                >
                    <Search />
                </Link>
                <Link
                    href={mineHref}
                    data-value={labels.mine}
                    className={cn("rounded-full p-2 transition-colors", isMine && "bg-muted text-primary")}
                >
                    <User />
                </Link>
            </ul>
        </div>
    )
}
