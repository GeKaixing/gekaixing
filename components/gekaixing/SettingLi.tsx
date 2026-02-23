import clsx from 'clsx';
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function SettingLi({
    icon,
    icon2 = <ChevronRight className="text-muted-foreground hover:text-foreground" />,
    text,
    className,
    href = "/imitation-x/settings/account"
}: {
    icon2?: React.ReactNode;
    icon: React.ReactNode;
    text: string;
    className?: string;
    href?: string;
}) {
    return (
        <Link
            href={href}
            className={clsx(
                "w-full px-6 py-2 hover:bg-muted/70 flex justify-between items-center transition-colors",
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
