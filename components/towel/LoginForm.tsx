'use client'

import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Button from './Button'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"

async function LoginFetch(email: string, password: string) {
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

    const form = useForm({
        defaultValues: {
            email: '',
            password: '',

        }
    })

    async function login() {
        const { email, password } = form.getValues();

        const result = await LoginFetch(email, password)
        const data = await result.json()
        if (data.success) {
            router.replace('/home')
        } else {
            toast.error(data.error || '登录失败，请重试')
        }
        
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => null)} className="space-y-4" >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="请输入邮箱" {...field} type='email' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="请输入密码" {...field} type='password' />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className='text-white bg-black'
                    onClick={login}
                >登入</Button>
            </form>
        </Form>
    )
}
