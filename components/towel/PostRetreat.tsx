'use client'

import { userStore } from "@/store/user";
import ArrowLeftBack from "./ArrowLeftBack";
import Link from "next/link";

export default function PostRetreat() {
    const { id } = userStore()
    return (<div className='flex justify-between'>
        {id ? <>
            <ArrowLeftBack></ArrowLeftBack>
            <button
                className='rounded-2xl font-bold bg-gray-500 text-white h-8 w-[60px]'
                onClick={() => {
                    const input = document.getElementById('replyInput');
                    if (input) {
                        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        (input as HTMLInputElement).focus();
                    }
                }}
            >
                回复
            </button>
        </> : <>
            <ArrowLeftBack></ArrowLeftBack>
            <Link
                href={'/account'}
                className='rounded-2xl flex justify-center items-center font-bold bg-gray-500 text-white h-8 w-[120px] '
            >
                请登录后回复
            </Link>
        </>}
    </div>)
}