"use client";

import { Plus } from 'lucide-react'
import React from 'react'
import { postModalStore } from '@/store/postModal'

export default function MobileAdd() {
    const { openModal } = postModalStore()

    return (
        <button
            onClick={openModal}
            className='w-16 h-16 rounded-2xl fixed bottom-16 right-16 text-white bg-blue-400 flex justify-center items-center cursor-pointer'>
            <Plus className='font-bold ' />
        </button>
    )
}
