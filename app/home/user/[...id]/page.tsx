import ArrowLeftBack from '@/components/towel/ArrowLeftBack'
import { AvatarFallback, Avatar, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PostCard from '@/components/towel/PostCard'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'

export default function page() {
    return (
        <div>
            <div className='h-8'> <ArrowLeftBack></ArrowLeftBack></div>
            <div className='bg-gray-400 w-full h-[200px]'></div>
            <div>
                <Avatar className="size-36 absolute  -translate-y-1/2 ">
                    <AvatarImage src="/logo.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
            <div className='flex'>
                <div className='w-full'></div>
                <UserEditDialog></UserEditDialog>
            </div>


            <div className='w-full h-14'></div>
            <div className='font-bold text-2xl'>NAME</div>
            <Tabs defaultValue="post" className="w-full">
                <TabsList className='w-full'>
                    <TabsTrigger value="post">帖子</TabsTrigger>
                    <TabsTrigger value="reply">回复</TabsTrigger>
                    <TabsTrigger value="article">文章</TabsTrigger>
                    <TabsTrigger value="media">媒体</TabsTrigger>
                    <TabsTrigger value="like">喜欢</TabsTrigger>
                </TabsList>
                <TabsContent value="post">
                    <PostCard></PostCard>
                </TabsContent>
                <TabsContent value="reply">    <PostCard></PostCard></TabsContent>
                <TabsContent value="article">    <PostCard></PostCard></TabsContent>
                <TabsContent value="media">    <PostCard></PostCard></TabsContent>
                <TabsContent value="like">    <PostCard></PostCard></TabsContent>
            </Tabs>
        </div>

    )
}
function UserEditDialog() {
    return (<Dialog>
        <DialogTrigger className='ml-auto!'>
            <div className='border-1 border-gray-400 h-9 flex justify-center items-center rounded-2xl p-4 mt-4 hover:bg-gray-200 whitespace-nowrap'>编辑个人资料</div>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    编辑个人资料</DialogTitle>
                <DialogDescription>
                    <Input type='text' placeholder='名字'></Input>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>)
}