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
const formSchema = z.object({
    email: z.string().email({
        message: "请输入有效的电子邮件地址。",
    }),
})
export default function SettingEmail() {
    const [status, setStatus] = useState(false)
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
                emailRedirectTo: "NEXT_PUBLIC_URL/home"
            }
        )
        if (data) {
            toast.success('已经向您的旧邮箱和新邮箱发送确认链接,请前往旧邮箱和新邮箱确认链接,完成修改电子邮箱')
            setStatus(false)
        } else {
            toast.error('修改失败')
            setStatus(false)
        }
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
    }

    return (
        <Dialog>
            <DialogTrigger>
                <SettingAccountLi icon={<PenLine />} text={'更改电子邮箱'}></SettingAccountLi>

            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>更改电子邮箱</DialogTitle>
                    <DialogDescription className='hidden'>
                    </DialogDescription>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>请输入你的新电子邮箱地址。</FormLabel>
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
                                {status ? <Spin></Spin> : '提交'}
                            </Button>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
