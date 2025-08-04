import 'react-advanced-cropper/dist/style.css';
import React, { useEffect, useRef, useState } from 'react';
import { CropperRef, Cropper, Priority, CircleStencil } from 'react-advanced-cropper';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Button from './Button';
import { Input } from '../ui/input';
import { uploadImageToSupabase } from '@/utils/function/uploadImageToSupabase';

export default function Cropped({ open, onOpenChange, type, fetch, user_background_image, user_avatar }: {
    user_background_image?: string,
    user_avatar?: string,
    open: boolean,
    onOpenChange: (open: boolean) => void
    type: string
    fetch: (url: string) => Promise<Response>
}) {
    const [image, setImage] = useState(user_background_image||user_avatar||'https://images.unsplash.com/photo-1599140849279-1014532882fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80');
    const cropperRef = useRef<CropperRef>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImage(url);
        }
    };
    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(image);
            }
        };
    }, [image]);

    // 裁剪后上传到 Supabase
    const handleUpload = async (type: string) => {
        if (!cropperRef.current) return;
        const canvas = cropperRef.current.getCanvas();
        if (!canvas) return;

        function canvasToFile(canvas: HTMLCanvasElement): Promise<File> {
            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        return reject(new Error('Blob 生成失败'));
                    }

                    const file = new File([blob], `${type}${Date.now()}.png`, {
                        type: 'image/png',
                    });

                    resolve(file);
                }, 'image/png');
            });
        }
        const file = await canvasToFile(canvas);

        const url = await uploadImageToSupabase(file, type)
        const reslut = await fetch(url)
        const data = reslut.json()

    };

    const onChange = (cropper: CropperRef) => {
        console.log(cropper.getCoordinates(), cropper.getCanvas(), cropper.getImage());
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger className='hidden'></DialogTrigger>
            <DialogContent className="max-w-[90vw] max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className='hidden'></DialogTitle>
                    <DialogDescription className='hidden'>
                    </DialogDescription>
                </DialogHeader>
                {type === 'user-background-image' ?
                    <Cropper
                        ref={cropperRef}
                        src={image}
                        stencilProps={{
                            aspectRatio: 16 / 9, // 宽高比16:9长方形
                            movable: true,
                            resizable: true,
                            minWidth: 160,
                            minHeight: 90,
                            initialSize: { width: 320, height: 180 },   // 初始大小
                            // initialPosition: { left: 50, top: 50 },  // 可选：初始位置
                        }}
                        onChange={onChange}
                        style={{ width: '100%', height: '400px' }}
                    /> :
                    <Cropper
                        ref={cropperRef}
                        src={image}
                        stencilComponent={CircleStencil}
                        stencilProps={{
                            aspectRatio: 16 / 9, // 宽高比16:9长方形
                            movable: true,
                            resizable: true,
                            minWidth: 160,
                            minHeight: 90,
                            initialSize: { width: 320, height: 180 },   // 初始大小
                            // initialPosition: { left: 50, top: 50 },  // 可选：初始位置
                        }}
                        onChange={onChange}
                        style={{ width: '100%', height: '400px' }}
                    />}
                <DialogFooter className='flex flex-col gap-6'>
                    <Input type='file' onChange={handleFileChange}></Input>
                    <Button onClick={() => handleUpload(type)}>确认</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
};