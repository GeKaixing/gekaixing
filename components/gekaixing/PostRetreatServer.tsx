

import { createClient } from "@/utils/supabase/server";
import ArrowLeftBack from "./ArrowLeftBack";
import Link from "next/link";
import PostRetreatClient from "./PostRetreatClient";

export default async function PostRetreatServer() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser()
    console.log(user?.id)
    const id = user?.id
    return (
        <div className='sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40'>
            <div className='flex justify-between pr-4 '>
                {id ? (
                    <PostRetreatClient></PostRetreatClient>
                ) : (
                    <div className="flex justify-between w-full items-center">
                        <ArrowLeftBack></ArrowLeftBack>
                        <Link
                            href={'/account'}
                            className='rounded-2xl flex justify-center items-center font-bold bg-gray-500 text-white h-8 w-[120px]'
                        >
                            请登录后回复
                        </Link>
                    </div>
                )}
            </div>
        </div>)
}