'use client'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Ellipsis } from 'lucide-react'
import { userStore } from '@/store/user'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
async function deletePost(id: string) {
    const result = await fetch(`/api/post`, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return result;
}
export default function PostDropdownMenu({ id, user_id }: { id: string, user_id: string }) {
    const user = userStore()
    const isCurrentUser = user.id === user_id; // Check if the post belongs to
    async function deleteHandler() {
        const result = await deletePost(id)
        const data=await result.json()
        if (data.success) {
            console.log('Post deleted successfully');
            // Optionally, you can trigger a re-fetch of posts or update the UI accordingly
        } else {
            console.error('Failed to delete post:', data.error);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>举报帖子</DropdownMenuItem>
                {isCurrentUser && <DropdownMenuItem
                    onClick={deleteHandler}
                >删除帖子</DropdownMenuItem>}
                <DropdownMenuItem>关注用户</DropdownMenuItem>
                <DropdownMenuItem>复制连接</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
// function DeleteAlertDialog({isopen, setOpen}: {isopen: boolean, setOpen: (open: boolean) => void}) {

//        return <AlertDialog open={isopen} onOpenChange={setOpen}>

//         <AlertDialogContent>
//             <AlertDialogHeader>
//                 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                     This action cannot be undone. This will permanently delete your account
//                     and remove your data from our servers.
//                 </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                 <AlertDialogAction>Continue</AlertDialogAction>
//             </AlertDialogFooter>
//         </AlertDialogContent>
//     </AlertDialog>
// }