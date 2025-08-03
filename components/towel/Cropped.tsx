import 'react-advanced-cropper/dist/style.css';
import React, { useState } from 'react';
import { CropperRef, Cropper } from 'react-advanced-cropper';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
export default function Cropped({ open, onOpenChange }: {
    open: boolean,
    onOpenChange: (open: boolean) => void
}) {
    const [image, setImage] = useState(
        'https://images.unsplash.com/photo-1599140849279-1014532882fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80',
    );

    const onChange = (cropper: CropperRef) => {
        console.log(cropper.getCoordinates(), cropper.getCanvas());
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger>修改头像</DialogTrigger>
            <DialogContent>
                dsadasddsadasdasdasasdsadsadasdasdsadsdasadsadasdasdasdasd
                <Cropper
                    src={image}
                    onChange={onChange}
                    className={'cropper'}
                />

            </DialogContent>
        </Dialog>

    )
};