
'use client'

import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Button from './Button'
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
import { useState } from 'react'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Spin from './Spin'
const formSchema = z.object({
    email: z.string().email({
        message: "请输入有效的电子邮件地址。",
    }),
    password: z.string().min(6, {
        message: "密码必须至少包含6个字符。",
    }),
})
async function SignupFetch(email: string, password: string) {
    const result = await fetch('/api/signup', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password,
            name: null,
            avatar: null
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return result
}
export default function SignupForm() {
    const [open, setOpen] = useState(false);

    const [status, setStatus] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: '',
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setStatus(true)
        const result = await SignupFetch(values.email, values.password)
        const data = await result.json()
        if (data.success) {
            setStatus(false)
            setOpen(true);
        } else {
            setStatus(false)
            toast.error('注册失败')
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>邮箱</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={status}
                                    placeholder="请输入邮箱"
                                    type='email'
                                    {...field}
                                />
                            </FormControl>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>密码</FormLabel>
                                        <FormControl>
                                            <Input disabled={status} placeholder="请输入密码" {...field} type='password' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormDescription className='hidden'>

                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit"
                    className='bg-black text-white'
                    disabled={status}
                >
                    {status ? <Spin></Spin> : '提交'}
                </Button>
            </form>

            <EnterMsmAlertDialog
                open={open}
                setOpen={setOpen}
            ></EnterMsmAlertDialog>
        </Form>
    )
}

function EnterMsmAlertDialog({
    open,
    setOpen
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {/* <Button className='bg-blue-500 text-white'>Open Alert</Button> */}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>确认邮件已经发送道你的邮箱</AlertDialogTitle>
                    <AlertDialogDescription>
                        请前往邮箱点击连接确认账户注册成功
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction>确认</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}