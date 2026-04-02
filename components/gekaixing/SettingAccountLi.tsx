import clsx from 'clsx';
import { ChevronRight } from 'lucide-react'
import React from 'react'

export default function SettingAccountLi({
    icon,
    icon2 = <ChevronRight className="h-4 w-4 text-muted-foreground" />,
    text,
    className
}: {
    icon2?: React.ReactNode;
    icon: React.ReactNode;
    text: string;
    className?: string
}) {
    return (
        <li
            className={clsx(
                "flex w-full items-center justify-between rounded-xl px-6 py-2 text-foreground transition-colors hover:bg-muted/70",
                className
            )}
        >
            <div className="flex items-center gap-2">
                {icon}
                {text}
            </div>
            {icon2}
        </li>
    )
}
