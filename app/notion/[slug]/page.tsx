// app/blog/[slug]/page.tsx
import "react-notion-x/src/styles.css";
import { NotionAPI } from "notion-client";
import { getDatabase } from "@/lib/notion";
import NotionPage from "../NotionPage";

const notion = new NotionAPI();

export async function generateStaticParams() {
    const posts = await getDatabase(process.env.NOTION_DATABASE_ID!);
    return posts.map((post: any) => ({
        slug: post.properties.title?.rich_text[0]?.plain_text
    }));
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
    const posts = await getDatabase(process.env.NOTION_DATABASE_ID!);
    const post = posts.find(
        (p: any) => p.properties.title?.rich_text[0]?.plain_text === decodeURIComponent(params.slug)
    );

    if (!post) return <div>文章未找到</div>;
    const recordMap = await notion.getPage(post.id);
    if (!recordMap) return <div>内容加载失败</div>;
    return (
        <div className="max-w-3xl mx-auto p-6">
            <NotionPage recordMap={recordMap} />
        </div>
    );
}
