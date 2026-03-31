'use client'
import React, { useState } from 'react'
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
import { deleteUnusedImages } from '@/utils/function/deleteUnusedImages'
import { findUrls } from '@/utils/function/findUrls'
import { postStore } from '@/store/post'
import { replyStore } from '@/store/reply'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'


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
export default function PostDropdownMenu({ post_id, id, reply_id, user_id, type = 'post', content }: { reply_id?: string | null, post_id?: string, content: string; id: string, user_id: string, type?: string }) {
    const user = userStore()
    const isCurrentUser = user.id === user_id; // Check if the post belongs to
    const [isopen, setOpen] = useState(false)
    const [AlertDialogOpen, setAlertDialogOpen] = useState(false)
    const pathName = usePathname()
    const router = useRouter()
    async function deleteHandler() {
        let result

        if (type === 'reply') {
            // 🔁 1. 找到被删的那一项（用于失败回滚）
            const deletedPost = replyStore.getState().replies.find((post) => post.id === id)


            // 🧹 2. 乐观更新 UI
            replyStore.getState().removeReply(id)
            toast.success('删除成功')
            // 🔨 3. 请求后端删除
            result = await deleteReply(id)

            const data = await result.json()

            if (data.success) {
                if (reply_id) {
                    postStore.getState().subReplyCount(reply_id!)
                } else {
                    postStore.getState().subReplyCount(post_id!)
                }
                const UrlsArray = findUrls(content)
                if (UrlsArray.length !== 0) {
                    const { data: UrlsArrayData, error: UrlsArrayError } = await deleteUnusedImages('post-image', UrlsArray)
                    
                }
            } else {
                // ❗️4. 删除失败，回滚 UI
                if (deletedPost) {
                    replyStore.getState().addReply(deletedPost)
                }
                toast.error('删除失败,回滚。')
            }

        } else {
            // 🔁 1. 找到被删的那一项（用于失败回滚）
            const deletedPost = postStore.getState().posts.find(post => post.id === id)


            // 🧹 2. 乐观更新 UI
            postStore.getState().deletePost(id)

            toast.success('删除成功')
            // 🔨 3. 请求后端删除
            result = await deletePost(id)

            const data = await result.json()

            if (data.success) {

                const UrlsArray = findUrls(content)
                if (UrlsArray.length !== 0) {
                    const { data: UrlsArrayData, error: UrlsArrayError } = await deleteUnusedImages('post-image', UrlsArray)
                  
                }
                if (pathName.includes('/gekaixing/status')) {
                    router.replace("/gekaixing")
                }

            } else {
                // ❗️4. 删除失败，回滚 UI
                if (deletedPost) {
                    postStore.getState().addPost(deletedPost)
                }
                toast.error('删除失败,回滚')
            }
        }
    }


    function report() {
        toast.success('感谢您的反馈')
    }

    function CopyLink() {
        if (type === 'reply') {
            copyToClipboard(`${process.env.NEXT_PUBLIC_URL}/gekaixing/reply/${id}`)
            return;
        }
        copyToClipboard(`${process.env.NEXT_PUBLIC_URL}/gekaixing/status/${id}`)

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
                {userStore.getState().id && userStore.getState().id !== user_id && (
                    <DropdownMenuItem onClick={() => router.push(`/gekaixing/chat?userId=${user_id}`)}>
                        私聊用户
                    </DropdownMenuItem>
                )}
                {userStore.getState().id && <DropdownMenuItem>关注用户</DropdownMenuItem>}
                <DropdownMenuItem onClick={CopyLink}>复制连接</DropdownMenuItem>
                <DropdownMenuItem >
                    <Link href={`/gekaixing/user/${user_id}`}>查看用户</Link>
                </DropdownMenuItem>
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
