"use client"
import React, { useEffect } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useState } from "react"
import { Content } from "@tiptap/react"
import { MinimalTiptapEditor } from '../ui/minimal-tiptap'
import { post_imagesStore } from "@/store/post_images"
import { createClient } from '@/utils/supabase/client'
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
import { userStore } from '@/store/user'

async function publishPost({
    user_id, // Replace with actual user ID
    user_name, // Replace with actual user name
    user_email, // Replace with actual user email
    value,
    user_avatar
}: {

    user_id: string,
    user_name: string,
    user_email: string,
    value: string,
    user_avatar: string
}) {

    const result = await fetch('/api/post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: user_id, // Replace with actual user ID
            user_name: user_name, // Replace with actual user name
            user_email:user_email, // Replace with actual user email
            content: value,
            user_avatar: user_avatar // Replace with actual user avatar URL
        })
    })
    return result
}

export default function EditPost() {
    const [value, setValue] = useState<Content>("")
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenAlertDialog, setIsOpenAlertDialog] = useState(false)
    const { poset_images } = post_imagesStore()
    const supabase = createClient()
    const {
        email,
        id,
        avatar, 
        name } = userStore()
    const bucketName = 'post-image' // 替换为你的桶名

    useEffect(() => {
        if (isOpen === false) {
            if (poset_images.length !== 0) {
                poset_images.forEach((image) => {
                    const filePath = image.split('/post-image/')[1]
                    supabase.storage.from(bucketName).remove([filePath])
                        .then((result) => {
                            console.log(result)
                        }).catch((error) => {
                            console.error('删除图片失败:', error)
                        })
                })
            }
            setValue("")
        }

    }, [isOpen])


    async function publish() {
        await publishPost(
            {
                user_id: id, // Replace with actual user ID
                user_name: name||email, // Replace with actual user name
                user_email: email, // Replace with actual user email
                value: value as string,
                user_avatar: avatar // Replace with actual user avatar URL
            }
        )
    }

    return (
        <TooltipProvider>

            <Dialog open={isOpen} onOpenChange={(e) => {
                if (value !== '') {
                    if (e === false) {
                        setIsOpenAlertDialog(true)
                    } else {
                        setIsOpen(e)
                    }
                    return
                }
                setIsOpen(e)
            }
            }>
                <DialogTrigger asChild>
                    <div
                        className="rounded-2xl bg-black text-xl h-9 w-[200px] text-white flex justify-center items-center hover:bg-black/80 cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    >
                        发布
                    </div>
                </DialogTrigger>
                <DialogContent className='!max-w-2xl !w-full'>
                    <DialogHeader>
                        <DialogTitle>有什么新鲜事？</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <MinimalTiptapEditor
                        publish={publish }
                        value={value}
                        onChange={setValue}
                        className="!max-w-[622px] w-full"
                        editorContentClassName="p-5  "
                        output="html"
                        placeholder="Enter your description..."
                        autofocus={true}
                        editable={true}
                        editorClassName="focus:outline-hidden"
                    />
                </DialogContent>
            </Dialog>
            <EditAlertDialog isOpen={isOpenAlertDialog} setIsOpen={setIsOpenAlertDialog} setIsOpenDialog={setIsOpen} />
        </TooltipProvider>
    )
}
function EditAlertDialog({ isOpen, setIsOpen, setIsOpenDialog }: { setIsOpenDialog: (open: boolean) => void, isOpen: boolean, setIsOpen: (open: boolean) => void }) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>确认删除</AlertDialogTitle>
                    <AlertDialogDescription>
                        确认删除所有未发布的内容吗？这将无法恢复。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => { setIsOpenDialog(true) }}>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { setIsOpenDialog(false) }}>确认</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
