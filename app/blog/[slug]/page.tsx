// app/blog/[slug]/page.tsx
import fs from 'fs'
import path from 'path'
import Navbar from '@/components/gekaixing/Navbar'
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import { marked } from 'marked'
import LandingPageFooter from '@/components/gekaixing/LandingPageFooter'

export async function generateStaticParams() {
    const markdownDir = path.join(process.cwd(), 'markdown')
    const files = fs.readdirSync(markdownDir)

    return files
        // 只保留 .md 文件
        .filter(file => file.endsWith('.md'))
        // 去掉 .md 后缀
        .map(file => ({
            slug: file.replace(/\.md$/, '')
        }))
}

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    // 如果还想读取文件内容
    const filePath = path.join(process.cwd(), 'markdown', `${decodeURIComponent(slug)}.md`)
    const content = fs.readFileSync(filePath, 'utf-8')

    return (
        <div>
            <Navbar />
            <div className='px-6 flex justify-center items-center '>
                <div className='h-screen' dangerouslySetInnerHTML={{ __html: marked.parse(content) }}></div>
            </div>
            <LandingPageFooter></LandingPageFooter>
        </div>
    )
}
