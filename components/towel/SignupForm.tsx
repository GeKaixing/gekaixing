
'use client'

import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from 'react'
import Button from './Button'
import clsx from 'clsx'
export default function SignupForm() {
    const form = useForm({
        defaultValues: {
            username: '',
            password: '',
            email: ''
        }
    })

    const [isShow, setShow] = useState(false);
    const [isProhibit, prohibit] = useState(false)
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => console.log(values))} className="space-y-4 ">
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
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="请输入邮箱" {...field} type="email" />
                            </FormControl>
                            <div className='bg-black text-white h-9 flex justify-center items-center rounded-2xl mt-3'
                                onClick={() => {
                                    setShow(true)
                                }}
                            >发送验证码</div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {isShow && <InputOTP
                    className='mt-6'
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>}

                <Button className={clsx('text-white', {
                    ' bg-gray-300': !isProhibit,
                    'bg-black': isProhibit
                })}>注册</Button>
            </form>
        </Form>
    )
}
