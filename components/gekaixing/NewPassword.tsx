import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { userStore } from '@/store/user'

const formSchema = z.object({
    password: z.string().min(6, {
        message: "密码必须至少包含6个字符。",
    }),
})
export default function NewPassword({ isopen, setOpen }: {
    isopen: boolean;
    setOpen: (b: boolean) => void
}) {
    const [status, setStatus] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        setStatus(true)
        const supabase = createClient()
        const { data, error } = await supabase.auth.updateUser({
            password: values.password // 这里是你的新密码
        })
        if (data) {
            toast.success('修改失败')
            setStatus(false)
            setOpen(false)
        } else {
            toast.error('修改失败')
            setStatus(false)
            setOpen(false)
        }
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
    }

    return (
        <Dialog open={isopen} onOpenChange={setOpen}>
            <DialogTrigger className='hidden'>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        确认你的新密码
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
                                        <FormLabel>请输入你的密码以获取。</FormLabel>
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
                                {status ? <Spin></Spin> : '提交'}
                            </Button>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
