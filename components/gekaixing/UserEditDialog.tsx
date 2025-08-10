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
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Spin from "./Spin"
import clsx from "clsx"


const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",

    }),
    brief_introduction: z.string().min(1, {
        message: "brief introduction must be at least 30 characters.",

    }),
})

export async function PATCHUser(username: string, brief?: string) {
    return fetch('/api/user', {
        method: 'PATCH',
        body: JSON.stringify({
            name: username,
            brief_introduction: brief,
        }),
    })
}


export default function UserEditDialog() {
    const [status, setStatus] = useState(false)
    const {name,brief_introduction}=userStore()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: name||"",
            brief_introduction: brief_introduction||""
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        // 没有要更新的字段就返回
        if (values.username === '' && values.brief_introduction === '') return

        setStatus(true)
        try {
            const res = await PATCHUser(values.username, values.brief_introduction)
            const data = await res.json()

            if (data.success) {
                toast.success('修改成功')
                userStore.setState({ name: values.username, brief_introduction: values.brief_introduction })
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


    return (<Dialog>
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
                        name="username"
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
                                {/* <FormDescription>

                                </FormDescription> */}
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
                                {/* <FormDescription>

                                </FormDescription> */}
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