import clsx from 'clsx';
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function SettingLi({
    icon,
    icon2 = <ChevronRight className="text-gray-400 hover:text-black" />,
    text,
    className
}: {
    icon2?: React.ReactNode;
    icon: React.ReactNode;
    text: string;
    className?: string
}) {
    return (
        <Link
            href="/home/settings/account"
            className={clsx(
                "w-full px-6 py-2 hover:bg-gray-200 flex justify-between items-center",
                className
            )}
        >
            <div className="flex items-center gap-2">
                {icon}
                {text}
            </div>
            {icon2}
        </Link>
    )
}
