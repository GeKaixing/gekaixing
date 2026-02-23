"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { userStore } from '@/store/user'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import UserBackgroundImage from '@/components/gekaixing/UserBackgroundImage'
import UserAvatar from "./UserAvatar"
import Button from "./Button"
import { useState } from "react"
import { toast } from "sonner"
import Spin from "./Spin"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"


export async function PATCHUser(username: string, userid: string, brief?: string) {
    return fetch('/api/user', {
        method: 'PATCH',
        body: JSON.stringify({
            name: username,
            userid: userid,
            briefIntroduction: brief,
        }),
    })
}


export default function UserEditDialog() {
    const t = useTranslations("Account.UserEditDialog")
    const [status, setStatus] = useState(false)
    const { name, userid, brief_introduction } = userStore()
    const router = useRouter()
    const formSchema = z.object({
        name: z
            .string()
            .min(3, t("validation.nameMin"))
            .max(50, t("validation.nameMax")),
        userid: z
            .string()
            .min(3, t("validation.useridMin"))
            .max(36, t("validation.useridMax"))
            .regex(/^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9]+)*$/, {
                message: t("validation.useridPattern"),
            }),
        brief_introduction: z
            .string()
            .max(200, t("validation.bioMax"))
            .optional(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: name || "",
            userid: userid || "",
            brief_introduction: brief_introduction || ""
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.name === '' && values.userid === '' && values.brief_introduction === '') return

        setStatus(true)
        try {
            const res = await PATCHUser(values.name, values.userid, values.brief_introduction)
            const data = await res.json()
            if (data.success) {
                toast.success(t("success"))
                userStore.setState({ name: values.name, userid: values.userid, brief_introduction: values.brief_introduction })
                router.refresh()
            } else {
                toast.error(data.error || t("failed"))
            }
        } catch (err) {
            toast.error(t("networkError"))
            console.error(err)
        } finally {
            setStatus(false)
        }
    }


    return (
        <Dialog>
            <DialogTrigger className='ml-auto!'>
                <div className='border-1 border-gray-400 h-9 flex justify-center items-center rounded-2xl p-4 mt-4 hover:bg-gray-200 whitespace-nowrap'>{t("editProfile")}</div>
            </DialogTrigger>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>
                        {t("editProfile")}
                    </DialogTitle>
                    <DialogDescription className="hidden">
                    </DialogDescription>
                </DialogHeader>

                <UserBackgroundImage></UserBackgroundImage>


                <UserAvatar></UserAvatar>

                <div className='w-full h-14'></div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("nameLabel")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={status}
                                            placeholder={t("namePlaceholder")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="userid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("useridLabel")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={status}
                                            placeholder={t("useridPlaceholder")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="brief_introduction"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("bioLabel")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={status}
                                            placeholder={t("bioPlaceholder")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit"
                            disabled={status}
                        >
                            {status ? <Spin></Spin> : t("submit")}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>)
}
