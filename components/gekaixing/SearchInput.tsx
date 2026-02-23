"use client"
import clsx from 'clsx'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function SearchInput() {
    const t = useTranslations("ImitationX.Search")
    const [isActive, setACtive] = useState(false)
    const router = useRouter()
    const [v, setV] = useState('')
    return (
        <div className={clsx('flex p-2 border-2 rounded-2xl bg-background transition-colors', {
            "border-border": !isActive,
            " border-blue-500": isActive
        })} onFocus={() => { setACtive(true) }}
            onBlur={() => { setACtive(false) }}
        >
            <Search></Search>
            <form 
            className='w-full'
            onSubmit={(e) => {
                e.preventDefault(); // ✅ 阻止表单默认提交
                if (v.trim() === '') return;
                router.push(`/imitation-x/search/?query=${v}`);
            }}>
                <input
                    type='text'
                    placeholder={t("placeholder")}
                    className='w-full border-0 focus:outline-none focus:ring-0 rounded-2xl'
                    value={v}
                    onChange={e => setV(e.target.value)}
                />
            </form>

        </div>
    )
}
