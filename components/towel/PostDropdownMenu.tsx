'use client'
import React, { use, useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from 'lucide-react'
import { userStore } from '@/store/user'
import { toast } from 'sonner'
import { copyToClipboard } from '@/utils/function/copyToClipboard'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'
import { deleteUnusedImages } from '@/utils/function/deleteUnusedImages'
import { findUrls } from '@/utils/function/findUrls'


async function deletePost(id: string) {
    const result = await fetch(`/api/post`, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return result;
}
async function deleteReply(id: string) {
    const result = await fetch(`/api/reply`, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return result;
}
export default function PostDropdownMenu({ id, user_id, type = 'post', content }: { content: string; id: string, user_id: string, type?: string }) {
    const user = userStore()
    const isCurrentUser = user.id === user_id; // Check if the post belongs to
    const [isopen, setOpen] = useState(false)
    const [AlertDialogOpen, setAlertDialogOpen] = useState(false)
    const router = useRouter()

    async function deleteHandler() {

        let result;

        if (type === 'reply') {
            result = await deleteReply(id)
        } else {
            result = await deletePost(id)
        }

        const data = await result.json()

        if (data.success) {
            toast.success('删除成功')
            router.refresh()
            const UrlsArray = findUrls(content)
            if (UrlsArray.length !== 0) {
                const { data:UrlsArrayData, error:UrlsArrayError } = await deleteUnusedImages('post-image', UrlsArray)
                console.log(UrlsArrayData, UrlsArrayError)
            }
        } else {
            toast.error('删除失败')
        }
    }

    function report() {
        toast.success('感谢您的反馈')
    }

    function CopyLink() {
        if (type === 'reply') {
            copyToClipboard(`${process.env.NEXT_PUBLIC_URL}/home/reply/${id}`)
            return;
        }
        copyToClipboard(`${process.env.NEXT_PUBLIC_URL}/home/status/${id}`)

    }

    return (
        <DropdownMenu open={isopen} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={report}>举报帖子</DropdownMenuItem>
                {isCurrentUser && <DropdownMenuItem
                    onClick={() => setAlertDialogOpen(true)}
                >删除帖子</DropdownMenuItem>}
                <DropdownMenuItem>关注用户</DropdownMenuItem>
                <DropdownMenuItem onClick={CopyLink}>复制连接</DropdownMenuItem>
            </DropdownMenuContent>
            <DeleteAlertDialog isopen={AlertDialogOpen} setOpen={setAlertDialogOpen} deleteHandler={deleteHandler}></DeleteAlertDialog>

        </DropdownMenu>
    )
}

function DeleteAlertDialog({ isopen, setOpen, deleteHandler }: { deleteHandler: () => void, isopen: boolean, setOpen: (open: boolean) => void }) {

    return <AlertDialog open={isopen} onOpenChange={setOpen}>

        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>您去确认吗？</AlertDialogTitle>
                <AlertDialogDescription>
                    您确认删除帖子吗?操作不可逆
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={deleteHandler}>确认</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
}