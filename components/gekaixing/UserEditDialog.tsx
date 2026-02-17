"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { userStore } from '@/store/user'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import UserBackgroundImage from '@/components/gekaixing/UserBackgroundImage'
import UserAvatar from "./UserAvatar"
import Button from "./Button"
import { useState } from "react"
import { toast } from "sonner"
import Spin from "./Spin"
import { useRouter } from "next/navigation"


const formSchema = z.object({
    name: z
        .string()
        .min(3, "名字不能为空")
        .max(50, "名字不能超过50个字符"),
    userid: z
        .string()
        .min(3, "用户ID至少3个字符")
        .max(36, "用户ID不能超过36个字符")
        .regex(/^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9]+)*$/, {
            message: "用户ID只能包含字母、数字、下划线和连字符",
        }),
    brief_introduction: z
        .string()
        .max(200, "简介不能超过200个字符")
        .optional(),
})

export async function PATCHUser(username: string, userid: string, brief?: string) {
    return fetch('/api/user', {
        method: 'PATCH',
        body: JSON.stringify({
            name: username,
            userid: userid,
            briefIntroduction: brief,
        }),
    })
}


export default function UserEditDialog() {
    const [status, setStatus] = useState(false)
    const { name, userid, brief_introduction } = userStore()
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: name || "",
            userid: userid || "",
            brief_introduction: brief_introduction || ""
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.name === '' && values.userid === '' && values.brief_introduction === '') return

        setStatus(true)
        try {
            const res = await PATCHUser(values.name, values.userid, values.brief_introduction)
            const data = await res.json()
            if (data.success) {
                toast.success('修改成功')
                userStore.setState({ name: values.name, userid: values.userid, brief_introduction: values.brief_introduction })
                router.refresh()
            } else {
                toast.error(data.error || '修改失败')
            }
        } catch (err) {
            toast.error('网络错误或服务器错误')
            console.error(err)
        } finally {
            setStatus(false)
        }
    }


    return (
        <Dialog>
            <DialogTrigger className='ml-auto!'>
                <div className='border-1 border-gray-400 h-9 flex justify-center items-center rounded-2xl p-4 mt-4 hover:bg-gray-200 whitespace-nowrap'>编辑个人资料</div>
            </DialogTrigger>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>
                        编辑个人资料
                    </DialogTitle>
                    <DialogDescription className="hidden">
                    </DialogDescription>
                </DialogHeader>

                <UserBackgroundImage></UserBackgroundImage>


                <UserAvatar></UserAvatar>

                <div className='w-full h-14'></div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>名字</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={status}
                                            placeholder="输入您的名字"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="userid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>用户ID</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={status}
                                            placeholder="输入您的用户ID"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="brief_introduction"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>简介</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={status}
                                            placeholder="输入您的简介"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit"
                            disabled={status}
                        >
                            {status ? <Spin></Spin> : '提交'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>)
}