"use client"

import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Content } from "@tiptap/react"
import { MinimalTiptapEditor } from '../ui/minimal-tiptap'
import { post_imagesStore } from "@/store/post_images"
import { createClient } from '@/utils/supabase/client'
import { userStore } from '@/store/user'
import { toast } from 'sonner'
import { findUnusedUrls } from '@/utils/function/findUnusedUrls'
import { deleteUnusedImages } from '@/utils/function/deleteUnusedImages'
import { postStore } from '@/store/post'
import { postModalStore } from '@/store/postModal'

async function publishPost({
    user_id,
    value,
}: {
    user_id: string,
    value: string,
}) {
    const result = await fetch('/api/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id,
            content: value,
        })
    })
    return result
}

interface EditPostProps {
    onClose?: () => void
}

export default function EditPost({ onClose }: EditPostProps) {
    const [value, setValue] = useState<Content>("")

    const { isOpen, openModal:setIsOpen} = postModalStore()
    const [isOpenAlertDialog, setIsOpenAlertDialog] = useState(false)
    const [isLogin, setLogin] = useState(false)
    const [saved, setSaved] = useState(false)
    const [status, setStatus] = useState(false)

    const { poset_images } = post_imagesStore()
    const supabase = createClient()
    const { closeModal } = postModalStore()
    const { email, id, user_avatar, name } = userStore()

    const bucketName = 'post-image'

    // 自动删除未保存图片
    useEffect(() => {
        if (!isOpen && poset_images.length !== 0 && !saved) {
            poset_images.forEach((image) => {
                const filePath = image.split('/post-image/')[1]
                supabase.storage.from(bucketName)
                    .remove([filePath])
                    .catch((error) => {
                        console.error('删除图片失败:', error)
                    })
            })
        }

        if (!isOpen) {
            setValue("")
        }
    }, [isOpen])

    function handleClose() {
        if (onClose) {
            onClose()
        } else {
            closeModal()
        }
    }

    async function publish() {
        if (!id) {
            setLogin(true)
            return
        }

        setStatus(true)

        const result = await publishPost({
            user_id: id,
            value: value as string,
        })

        const data = await result.json()
        const unusedPictures = findUnusedUrls(value as string, poset_images)

        if (data.success) {
            postStore.getState().addPost({
                id: data.data[0]['id'],
                user_id: id,
                user_name: name,
                user_email: email,
                user_avatar: user_avatar,
                content: value as string,
                like: 0,
                star: 0,
                reply_count: 0,
                share: 0,
            })

            setSaved(true)
            setStatus(false)
            setValue("")
            setIsOpen()
            toast.success('发布成功')
        } else {
            setStatus(false)
            toast.error('发布失败')
        }

        if (unusedPictures.length !== 0) {
            await deleteUnusedImages('post-image', unusedPictures)
        }
    }

    return (
        <TooltipProvider>
            <Dialog

                open={isOpen}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen && value !== '') {
                        // 有内容时拦截关闭
                        setIsOpenAlertDialog(true)
                        return
                    }

                    setIsOpen()

                    if (!nextOpen) {
                        handleClose()
                    }
                }}
            >
                <DialogContent className='!max-w-2xl !w-full'>
                    <DialogHeader>
                        <DialogTitle>有什么新鲜事？</DialogTitle>
                        <DialogDescription />
                    </DialogHeader>

                    <MinimalTiptapEditor
                        status={status}
                        publish={publish}
                        value={value}
                        onChange={setValue}
                        className="!max-w-[622px] w-full"
                        editorContentClassName="p-5"
                        output="html"
                        placeholder="Enter your description..."
                        autofocus
                        editable
                        editorClassName="focus:outline-hidden"
                    />
                </DialogContent>
            </Dialog>

            {/* 草稿确认弹窗 */}
            <EditAlertDialog
                saved={saved}
                isOpen={isOpenAlertDialog}
                setIsOpen={setIsOpenAlertDialog}
                setIsOpenDialog={setIsOpen}
            />

            {/* 登录弹窗 */}
            <LoginDialog
                isOpen={isLogin}
                setIsOpen={setLogin}
            />
        </TooltipProvider>
    )
}

function EditAlertDialog({
    isOpen,
    setIsOpen,
    setIsOpenDialog,
    saved
}: {
    saved: boolean
    setIsOpenDialog: (open: boolean) => void
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>确认关闭</AlertDialogTitle>
                    <AlertDialogDescription>
                        {saved
                            ? '内容已发布，确认关闭？'
                            : '确认删除所有未发布内容吗？此操作无法恢复。'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={() => {
                            setIsOpen(false)
                        }}
                    >
                        取消
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            setIsOpen(false)
                            setIsOpenDialog(false)
                        }}
                    >
                        确认
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

function LoginDialog({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>请登录</AlertDialogTitle>
                    <AlertDialogDescription>
                        登录后才能发布内容。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setIsOpen(false)}>
                        取消
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => setIsOpen(false)}>
                        确认
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
