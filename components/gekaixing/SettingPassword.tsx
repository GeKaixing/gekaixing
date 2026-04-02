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
import { Lock } from 'lucide-react'
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
import Spin from './Spin'
import { LoginFetch } from './LoginForm'
import { userStore } from '@/store/user'
import NewPassword from './NewPassword'
import { useTranslations } from 'next-intl'

export default function SettingPassword() {
    const t = useTranslations('Account.SettingPassword')
    const [status, setStatus] = useState(false)
    const { email } = userStore()
    const [isopen, setOpen] = useState(false)
    const formSchema = z.object({
        password: z.string().min(6, {
            message: t('validation.passwordMin'),
        }),
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setStatus(true)
        const reslut = await LoginFetch(email, values.password)
        const data = await reslut.json()
        if (data.success) {
            setStatus(false)
            setOpen(true)
        } else {
            setStatus(false)
            setOpen(false)
        }
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
    }

    return (
        <>

            <Dialog>
                <DialogTrigger>
                    <SettingAccountLi icon={<Lock />} text={t('entry')}></SettingAccountLi>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {t('title')}
                        </DialogTitle>
                        <DialogDescription className='hidden'>
                        </DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('passwordLabel')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={status}
                                                    {...field}
                                                    type='password' />
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
            <NewPassword isopen={isopen} setOpen={setOpen}></NewPassword>
        </>
    )
}
