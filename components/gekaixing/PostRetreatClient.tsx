'use client'
import ArrowLeftBack from './ArrowLeftBack';

export default function PostRetreatClient() {
    return (
        <div className="flex justify-between w-full items-center">
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
        </div>
    )
}
