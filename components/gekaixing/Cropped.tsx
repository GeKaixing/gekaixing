"use client"

import 'react-advanced-cropper/dist/style.css'
import React, { useEffect, useRef, useState } from 'react'
import { CropperRef, Cropper, CircleStencil } from 'react-advanced-cropper'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog"
import Button from './Button'
import { Input } from '../ui/input'
import Spin from './Spin'
import clsx from 'clsx'
import { toast } from 'sonner'
import { userStore } from '@/store/user'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function Cropped({
    open,
    onOpenChange,
    type,
    fetch,
    user_background_image,
    user_avatar,
}: {
    user_background_image?: string
    user_avatar?: string
    open: boolean
    onOpenChange: (open: boolean) => void
    type: string
    fetch: (url: string) => Promise<Response>
}) {
    const [image, setImage] = useState(
        user_background_image ||
        user_avatar ||
        'https://images.unsplash.com/photo-1599140849279-1014532882fe'
    )

    const cropperRef = useRef<CropperRef>(null)
    const [status, setStatus] = useState(false)
    const [isButton, setButton] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    // ========= 自动释放 objectURL =========
    useEffect(() => {
        return () => {
            if (image?.startsWith('blob:')) {
                URL.revokeObjectURL(image)
            }
        }
    }, [image])

    // ========= 选择文件 =========
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setImage(url)
    }

    // ========= canvas → file =========
    function canvasToFile(canvas: HTMLCanvasElement): Promise<File> {
        return new Promise((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) return reject('Blob 生成失败')

                resolve(
                    new File([blob], `${type}.png`, {
                        type: 'image/png',
                    })
                )
            }, 'image/png')
        })
    }

    // ========= 上传到 Supabase（覆盖模式，无垃圾文件） =========
    async function uploadImage(file: File) {
        const userId = userStore.getState().id || 'anonymous'

        // ⭐ 固定路径（不会产生多余文件）
        const filePath = `${type}/${userId}.png`

        const { error } = await supabase.storage
            .from('images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: true, // ⭐ 覆盖旧文件
            })
        if (error) throw error

        const { data, } = supabase.storage
            .from('images')
            .getPublicUrl(filePath)
        // ⭐ 防浏览器缓存
        return `${data.publicUrl}?t=${Date.now()}`
    }

    // ========= 上传处理 =========
    const handleUpload = async () => {
        if (!cropperRef.current) return

        const canvas = cropperRef.current.getCanvas()
        if (!canvas) return

        try {
            setStatus(true)

            const file = await canvasToFile(canvas)
            const url = await uploadImage(file)
            // 更新数据库
            const res = await fetch(url)
            const data = await res.json()

            if (data.success) {
                toast.success('修改成功')

                if (type === 'user-background-image') {
                    userStore.setState({ user_background_image: url })
                    router.refresh() //刷新
                } else {
                    userStore.setState({ user_avatar: url })
                    router.refresh() //刷新
                }

                onOpenChange(false)
            } else {
                toast.error('修改失败')
            }
        } catch (err) {
            console.error(err)
            toast.error('上传失败')
        } finally {
            setStatus(false)
        }
    }

    // ========= cropper 变化 =========
    const onChange = () => {
        setButton(true)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger className="hidden" />

            <DialogContent className="max-w-[90vw] max-h-[90vh]">
                <DialogHeader />

                {type === 'user-background-image' ? (
                    <Cropper
                        ref={cropperRef}
                        src={image}
                        stencilProps={{
                            aspectRatio: 16 / 9,
                            movable: true,
                            resizable: true,
                        }}
                        onChange={onChange}
                        style={{ width: '100%', height: '400px' }}
                    />
                ) : (
                    <Cropper
                        ref={cropperRef}
                        src={image}
                        stencilComponent={CircleStencil}
                        onChange={onChange}
                        style={{ width: '100%', height: '400px' }}
                    />
                )}

                {status ? (
                    <DialogFooter className="flex justify-center">
                        <Spin />
                    </DialogFooter>
                ) : (
                    <DialogFooter className="flex flex-col gap-6">
                        <Input type="file" accept="image/*" onChange={handleFileChange} />

                        <Button
                            disabled={!isButton}
                            onClick={handleUpload}
                            className={clsx({
                                'bg-black text-white': isButton,
                            })}
                        >
                            确认
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
