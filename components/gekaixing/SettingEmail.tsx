 "use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import SettingAccountLi from './SettingAccountLi'
import { PenLine } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import Spin from './Spin'
import { useTranslations } from 'next-intl'
export default function SettingEmail() {
    const t = useTranslations('Account.SettingEmail')
    const [status, setStatus] = useState(false)
    const formSchema = z.object({
        email: z.string().email({
            message: t('validation.email'),
        }),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setStatus(true)
        const supabase = createClient()
        const { data, error } = await supabase.auth.updateUser(
            {
                email: values.email,
            },
            {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/imitation-x`
            }
        )
        if (data) {
            toast.success(t('success'))
            setStatus(false)
        } else {
            toast.error(t('failed'))
            setStatus(false)
        }
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
    }

    return (
        <Dialog>
            <DialogTrigger>
                <SettingAccountLi icon={<PenLine />} text={t('entry')}></SettingAccountLi>

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription className='hidden'>
                    </DialogDescription>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('newEmailLabel')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={status}
                                                placeholder="alice@example.com" {...field} type='email' />
                                        </FormControl>
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
                                {status ? <Spin></Spin> : t('submit')}
                            </Button>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
