'use client'
import ArrowLeftBack from './ArrowLeftBack';
import { useTranslations } from 'next-intl';

export default function PostRetreatClient() {
    const t = useTranslations("ImitationX.StatusHeader")
    return (
        <div className="flex justify-between w-full items-center">
            <ArrowLeftBack name={t("back")}></ArrowLeftBack>
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
                {t("reply")}
            </button>
        </div>
    )
}
