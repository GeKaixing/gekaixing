import { Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function MobileAdd() {
    return (
        <Link
            href={'/home/post'}
            className='w-16 h-16 rounded-2xl fixed bottom-16 right-16 text-white bg-blue-400 flex justify-center items-center'>
            <Plus className='font-bold ' />
        </Link>
    )
}
