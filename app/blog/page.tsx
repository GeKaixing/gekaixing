import Navbar from '@/components/gekaixing/Navbar'
import React from 'react'
import fs from 'fs'
import path from 'path'
import { Card, CardContent } from '@/components/ui/card'
import { marked } from 'marked'
import Link from 'next/link'
import LandingPageFooter from '@/components/gekaixing/LandingPageFooter'
import BlogSearch from '@/components/gekaixing/BlogSearch'

function getAllPosts() {
    const markdownDir = path.join(process.cwd(), 'markdown')
    const files = fs.readdirSync(markdownDir)

    return files
        .filter(file => file.endsWith('.md'))
        .map(file => {
            const slug = file.replace(/\.md$/, '')
            const filePath = path.join(markdownDir, file)
            const content = fs.readFileSync(filePath, 'utf-8')
            return { slug, content }
        })
}

export default function page() {
    const posts = getAllPosts()
    return (
        <div>
            <Navbar />
            <BlogSearch data={posts}></BlogSearch>
            <div className='px-6'>
                <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 '>
                    {posts.map(post => (
                        <Link  key={post.slug} href={'/blog/' + post.slug}>
                            <Card >
                                <CardContent>
                                    <h2 className='text-xl font-bold'>{post.slug}</h2>
                                    <div className='line-clamp-3 h-full  max-h-[128px] overflow-hidden' dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }}></div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </ul>
            </div>
            <LandingPageFooter className='mt-16'></LandingPageFooter>
        </div>
    )
}
