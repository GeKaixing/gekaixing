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
import { Button } from '@/components/ui/button'
import UserBackgroundImage from '@/components/towel/UserBackgroundImage'
import UserAvatar from "./UserAvatar"


const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})
async function PATCHUser(name: string) {
    const result = await fetch('/api/user', {
        method: 'PATCH',
        body: JSON.stringify({
            name: name,
        }),
    })
    return result;
}

export default function UserEditDialog() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        PATCHUser(values.username)
    }

    return (<Dialog>
        <DialogTrigger className='ml-auto!'>
            <div className='border-1 border-gray-400 h-9 flex justify-center items-center rounded-2xl p-4 mt-4 hover:bg-gray-200 whitespace-nowrap'>编辑个人资料</div>
        </DialogTrigger>
        <DialogContent>

            <DialogHeader>
                <DialogTitle>
                    编辑个人资料
                </DialogTitle>
                {/* <DialogDescription>
                </DialogDescription> */}
            </DialogHeader>

            <UserBackgroundImage></UserBackgroundImage>


            <UserAvatar></UserAvatar>

            <div className='w-full h-14'></div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>名字</FormLabel>
                                <FormControl>
                                    <Input placeholder="输入您的名字" {...field} />
                                </FormControl>
                                {/* <FormDescription>

                                </FormDescription> */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">提交</Button>
                </form>
            </Form>
        </DialogContent>
    </Dialog>)
}