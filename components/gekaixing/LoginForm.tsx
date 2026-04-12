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
import { useTranslations } from 'next-intl'
import { signIn } from 'next-auth/react'
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
    const t = useTranslations('Account.LoginForm')
    const router = useRouter();
    const [status, setStatus] = useState(false)
    const formSchema = z.object({
        email: z.string().email({
            message: t('validation.email'),
        }),
        password: z.string().min(6, {
            message: t('validation.passwordMin'),
        }),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setStatus(true)
        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        })

        if (!result?.error) {
            router.replace("/gekaixing")
        } else {
            toast.error(t('loginFailed'))
        }
        setStatus(false)
    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('emailLabel')}</FormLabel>
                            <FormControl>
                                <Input
                                    disabled={status}
                                    placeholder={t('emailPlaceholder')}
                                    type='email'
                                    {...field}
                                />
                            </FormControl>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('passwordLabel')}</FormLabel>
                                        <FormControl>
                                            <Input disabled={status} placeholder={t('passwordPlaceholder')} {...field} type='password' />
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
                    className='w-full bg-black text-white'
                    disabled={status}
                >
                    {status ? <Spin></Spin> : t('submit')}
                </Button>
            </form>
        </Form>
    )
}
