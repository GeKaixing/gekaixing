import clsx from 'clsx'
import React from 'react'

export default function Line({className}:{
    className?: string | null | undefined
}) {
    return (
        <div className={clsx("w-full border-t border-gray-200 ",className )}/>
    )
}
