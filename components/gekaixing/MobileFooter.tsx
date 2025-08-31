import { House, Search, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function MobileFooter({id}:{id:string|undefined}) {
    return (
        <div className='sm:hidden fixed bottom-0  w-full flex flex-row  px-6 py-2 shadow border'>
            <ul className='w-full flex items-center justify-around'>
                <Link href={'/imitation-x'} data-value='主页'><House /></Link>
                <Link href={'/imitation-x/explore'} data-value='搜索'> <Search></Search></Link>
                <Link href={`/imitation-x/user/${id}`} data-value='我的'><User></User></Link>
            </ul>
        </div>
    )
}
