
'use client'

import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Button from './Button'
import clsx from 'clsx'
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

async function SignupFetch(email: string, password: string) {
    const result = await fetch('/api/signup', {
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
export default function SignupForm() {
    const [open, setOpen] = useState(false);

    const form = useForm({
        defaultValues: {
            password: '',
            email: ''
        }
    })

    async function signup() {

        const { password, email } = form.getValues();
        const result = await SignupFetch(email, password)
        const data = await result.json()
        if (data.success) {
            setOpen(true);
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => console.log(values))} className="space-y-4 ">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="请输入邮箱" {...field} type="email" />
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
                <Button
                    onClick={signup}
                    className={clsx('text-white bg-black')}>注册</Button>
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