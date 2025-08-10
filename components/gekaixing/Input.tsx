import { cn } from '@/lib/utils'
import * as React from 'react'

export default function Input({ className,placeholder, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input type={type}
            data-slot="input"
            placeholder={placeholder}
            className={cn('border-0 focus:outline-none focus:ring-0 rounded-2xl', className)}
            {...props}
        />
    )
}
