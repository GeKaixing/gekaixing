'use client'

import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Button from './Button'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"
import Spin from './Spin'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from 'zod'
import { useState } from 'react'

const formSchema = z.object({
    email: z.string().email({
        message: "请输入有效的电子邮件地址。",
    }),
    password: z.string().min(6, {
        message: "密码必须至少包含6个字符。",
    }),
})
export async function LoginFetch(email: string, password: string) {
    const result = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return result
}


export default function LoginForm() {
    const router = useRouter();
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
        const result = await LoginFetch(values.email, values.password)
        const data = await result.json()
        if (data.success) {
            setStatus(false)
            router.replace('/home')
        } else {
            setStatus(false)
            toast.error(data.error || '登录失败，请重试')
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
                                            <Input  disabled={status} placeholder="请输入密码" {...field} type='password' />
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
        </Form>
    )
}
