import { House, LogIn, Settings } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
    return (
        <nav className="w-[300px] h-screen flex justify-center  ">
            <ul className=" space-y-6">
                <li className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                    <House />
                    <Link href="/home">主页</Link></li>

                <li  className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                    <Settings></Settings>
                    <Link href="/home/settings">设置</Link></li>

                <li  className="flex gap-2 text-xl font-bold hover:bg-gray-50 rounded-2xl p-2 ">
                    <LogIn></LogIn>
                    <Link href="/account">登录</Link></li>
                <li className="rounded-2xl bg-black text-xl h-9 w-[200px] text-white flex justify-center items-center 
                hover:bg-black/80
                "><Link href="/home/post">发布</Link></li>
            </ul>
        </nav>
    )
}