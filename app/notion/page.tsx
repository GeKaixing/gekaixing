'use server';
import { Card, CardContent } from "@/components/ui/card";
import { getDatabase } from "@/lib/notion";
import Image from "next/image";
import Link from "next/link";

export default async function Page() {
    const posts = await getDatabase(process.env.NOTION_DATABASE_ID!);
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">博客列表</h1>
            <ul className="space-y-4">

                {posts.map((post: any) => {
                    const title = post.properties.title?.rich_text[0]?.plain_text || "无标题";
                    const direction = post.properties.direction?.rich_text[0]?.plain_text || "no-direction";
                    const date = post.properties.Date?.date?.start || "无日期";
                    const cover = post.properties.cover?.files[0].file?.url;
                    return (
                        <li key={post.id} >
                            <Card className="rounded-2xl w-[80%] sm:w-[316px] hover:shadow-lg transition-shadow p-4  flex flex-col gap-2">
                                <Link href={`/notion/${title}`} className="text-xl">
                                    <div className="relative w-[278px] h-[217px] rounded-2xl overflow-hidden">
                                        <Image src={cover} alt="blog cover" fill className="object-cover"></Image>
                                    </div>
                                    <div className=" w-[278px] overflow-hidden text-ellipsis text-xl font-bold">{title}</div>
                                    <div className="w-[278px] overflow-hidden text-ellipsis ">{direction}</div>
                                    <p className="text-sm text-gray-500 ">{date}</p>
                                </Link>
                            </Card>
                        </li>
                    );
                })}
            </ul>
        </div >
    );
}
