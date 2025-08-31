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
import { toast } from 'sonner'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { findUnusedUrls } from '@/utils/function/findUnusedUrls'
import { deleteUnusedImages } from '@/utils/function/deleteUnusedImages'
import { postStore } from '@/store/post'




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
            user_email: user_email, // Replace with actual user email
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
    const [saved, setSaved] = useState(false)
    const [status, setStatus] = useState(false)
    const [isLogin, setLogin] = useState(false)
    const Pathname = usePathname()

    const {
        email,
        id,
        user_avatar,
        name } = userStore()
    const bucketName = 'post-image' // 替换为你的桶名

    useEffect(() => {
        if (isOpen === false) {
            if (poset_images.length !== 0) {
                if (!saved) {
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

            }
            // router.back()    
            setValue("")
        }

    }, [isOpen])


    async function publish() {
        if (!id) { setLogin(true); return };
        setStatus(true)

        const reslut = await publishPost(
            {
                user_id: id, // Replace with actual user ID
                user_name: name || email, // Replace with actual user name
                user_email: email, // Replace with actual user email
                value: value as string,
                user_avatar: user_avatar // Replace with actual user avatar URL
            }
        )
        const data = await reslut.json()
        const Unused_pictures = findUnusedUrls(value as string, poset_images)
        if (data.success) {
            if (Pathname === '/imitation-x') {
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
            }
             setSaved(true);
            setStatus(false);
            setValue("");
            setIsOpen(false)
            toast.success('发布成功');
        } else {
            toast.success('发布失败')
        }
        if (Unused_pictures.length !== 0) {
            const { data: UnusedImagesData, error: UnusedImagesError } = await deleteUnusedImages('post-image', Unused_pictures)
            console.log(UnusedImagesData, UnusedImagesError)
        }

    }

    return (
        <TooltipProvider>

            <Dialog open={isOpen} onOpenChange={(e) => {
                if (value !== '') {
                    console.log(e)
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
                <DialogTrigger asChild >
                    <div
                        className="rounded-2xl bg-black text-xl h-9 w-[200px] text-white flex justify-center items-center hover:bg-black/80 cursor-pointer"
                        onClick={() => { setIsOpen(true); setSaved(false) }}
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
                        status={status}
                        publish={publish}
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
            <LoginDialog isOpen={isLogin} setIsOpen={setLogin} ></LoginDialog>
            {<EditAlertDialog saved={saved} isOpen={isOpenAlertDialog} setIsOpen={setIsOpenAlertDialog} setIsOpenDialog={setIsOpen} />}
        </TooltipProvider>
    )
}
function EditAlertDialog({ isOpen, setIsOpen, setIsOpenDialog, saved }: { saved: boolean; setIsOpenDialog: (open: boolean) => void, isOpen: boolean, setIsOpen: (open: boolean) => void }) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>确认删除</AlertDialogTitle>
                    <AlertDialogDescription>
                        {saved ? '还有内容,还需要继续编写吗？' :
                            "确认删除所有未发布的内容吗？这将无法恢复。"}
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

function LoginDialog({ isOpen, setIsOpen, }: { isOpen: boolean, setIsOpen: (open: boolean) => void }) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>请登录</AlertDialogTitle>
                    <AlertDialogDescription>
                        登录后才能发布哦。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => { setIsOpen(true) }}>取消</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { setIsOpen(false) }}>确认</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

