'use client'

import { userStore } from "@/store/user";
import ArrowLeftBack from "./ArrowLeftBack";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function PostRetreat() {
    const t = useTranslations("ImitationX.StatusHeader")
    const { id } = userStore()
    return (
        <div className='sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40'>
            <div className='flex justify-between pr-4 '>
                {id ? (
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
                ) : (
                    <div className="flex justify-between w-full items-center">
                        <ArrowLeftBack name={t("back")}></ArrowLeftBack>
                        <Link
                            href={'/account'}
                            className='rounded-2xl flex justify-center items-center font-bold bg-gray-500 text-white h-8 w-[120px]'
                        >
                            {t("loginToReply")}
                        </Link>
                    </div>
                )}
            </div>
        </div>)
}
