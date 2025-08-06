"use client"
import clsx from 'clsx'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function SearchInput() {
    const [isActive, setACtive] = useState(false)
    const router = useRouter()
    const [v, setV] = useState('')
    return (
        <div className={clsx('flex p-2 border-2  rounded-2xl', {
            "border-gray-200": !isActive,
            " border-blue-500": isActive
        })} onFocus={() => { setACtive(true) }}
            onBlur={() => { setACtive(false) }}
        >
            <Search></Search>
            <form onSubmit={(e) => {
                e.preventDefault(); // ✅ 阻止表单默认提交
                if (v.trim() === '') return;
                router.push(`/home/search/?query=${v}`);
            }}>
                <input
                    type='text'
                    placeholder='搜索'
                    className='border-0 focus:outline-none focus:ring-0 rounded-2xl'
                    value={v}
                    onChange={e => setV(e.target.value)}
                />
            </form>

        </div>
    )
}
