'use server';
import { getDatabase } from "@/lib/notion";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
    const posts = await getDatabase(process.env.NOTION_DATABASE_ID!);
    console.log(posts)
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">博客列表</h1>
            <ul className="space-y-4">
                {posts.map((post: any) => {
                    const title = post.properties.title?.title[0]?.plain_text || "无标题";
                    const direction = post.properties.direction?.rich_text[0]?.plain_text || "no-direction";
                    const date = post.properties.Date?.date?.start || "无日期";
                    const cover = post.properties.cover?.files[0].file?.url;
                    return (
                        <li key={post.id} className="border-b pb-2">
                            <Link href={`/notion/${title}`} className="text-xl text-blue-600">
                                <div className="relative w-[278px] h-[217px]">
                                    <Image src={cover} alt="blog cover" fill className="object-cover"></Image>
                                </div>
                                {title}<p></p>
                                {direction}
                            </Link>
                            <p className="text-sm text-gray-500">{date}</p>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
