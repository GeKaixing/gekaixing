'use client'

import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Button from './Button'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            username: '',
            password: '',
            email: ''
        }
    })
    function login() {
        router.replace('/home')
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => console.log(values))} className="space-y-4">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="请输入用户名" {...field} />
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
