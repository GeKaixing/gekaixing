import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Trash } from 'lucide-react'
import SettingAccountLi from './SettingAccountLi'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Spin from './Spin'
import { useForm } from "react-hook-form"
import { userStore } from '@/store/user'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { LoginFetch } from './LoginForm'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export async function DeleteAccountFetch(id: string) {
    const result = await fetch('/api/user', {
        method: 'DELETE',
        body: JSON.stringify({
            userId: id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return result
}

const formSchema = z.object({
    password: z.string().min(6, {
        message: "密码必须至少包含6个字符。",
    }),
})

export default function SettingDeleteAccount() {
    const [status, setStatus] = useState(false);
    const [isopen, setOpen] = useState(false);
    const [settingDeleteAccountOpen, setSettingDeleteAccountOpen] = useState(false)
    const { email } = userStore();
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
            <Dialog open={settingDeleteAccountOpen} onOpenChange={setSettingDeleteAccountOpen}>
                <DialogTrigger>
                    <SettingAccountLi className='text-red-500 ' icon={<Trash />} text={'删除账户'}></SettingAccountLi>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            删除账户
                        </DialogTitle>
                        <DialogDescription>
                            删除账户不可逆,您将失去所有数据,确认是您本人
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
            <EnterDeleteAccountDialog isopen={isopen} setOpen={setOpen} setSettingDeleteAccountOpen={setSettingDeleteAccountOpen}></EnterDeleteAccountDialog>
        </>

    )
}

function EnterDeleteAccountDialog({ isopen, setOpen, setSettingDeleteAccountOpen }: {
    isopen: boolean;
    setOpen: (b: boolean) => void;
    setSettingDeleteAccountOpen: (b: boolean) => void;
}) {
    const { id } = userStore()
    const router = useRouter()
    const [status, setStatus] = useState(false);

    async function enter() {
        setStatus(true)
        const reslut = await DeleteAccountFetch(id)
        const data = await reslut.json()
        if (data.success) {

            router.replace("/account")
        } else {
            toast.error('删除失败')
        }
        setStatus(false)
    }
    return <Dialog open={isopen} onOpenChange={setOpen}>
        <DialogTrigger className='hidden'>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    删除账户
                </DialogTitle>
                <DialogDescription>
                    你已经通过密码认证,确认删除您的账户吗,您的数据将遗失,不可恢复。
                </DialogDescription>
                {status ?
                    <div className='w-full flex justify-center items-center'>
                        <Spin />
                    </div> :
                    <DialogFooter>
                        <Button onClick={() => { setOpen(false); setSettingDeleteAccountOpen(false) }}>取消   </Button>
                        <Button className='bg-red-500' onClick={enter}> 确认</Button>
                    </DialogFooter>}

            </DialogHeader>
        </DialogContent>
    </Dialog>
}