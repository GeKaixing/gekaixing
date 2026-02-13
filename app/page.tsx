import CookieConsent from '@/components/gekaixing/CookieConsent'
import Navbar from '@/components/gekaixing/Navbar'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import * as motion from "motion/react-client"
import LandingPageFooter from '@/components/gekaixing/LandingPageFooter'
import fs from 'fs'
import path from 'path'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { marked } from 'marked'
import { Plus } from 'lucide-react'
import { ExampleMarquee } from '@/components/kibo-ui/marquee'
import { createClient } from '@/utils/supabase/server'

function getAllPosts() {
  const markdownDir = path.join(process.cwd(), 'markdown')
  const files = fs.readdirSync(markdownDir)
  const data =
    files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const slug = file.replace(/\.md$/, '')
        const filePath = path.join(markdownDir, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        return { slug, content }
      })
  return data.slice(0, 5)
}
export default async function page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className='bg-[#e9e9e9] px-6 flex flex-col justify-center items-center'>
      <Navbar user={user} />
      <CookieConsent></CookieConsent>
      <section className='w-dvw h-dvh flex flex-col justify-center items-center space-y-12'>
        <h1 className='flex flex-row whitespace-nowrap  text-5xl font-bold max-sm:hidden'> This website <div className='text-blue-400'>&nbsp;is&nbsp;</div> used for job hunting </h1>
        <h1 className='text-5xl font-bold flex flex-col justify-center items-center sm:hidden'> This website
          <div className='text-blue-400'>is
          </div> used for job <div>
            hunting
          </div>
        </h1>
        <div className='grid grid-cols-1 gap-4 place-content-center place-items-center'>
          <Link href='/blog' className='text-[16px] font-semibold'>here is my blog</Link>
          <Link href='../curriculum-vitae/curriculum-vitae.pdf' target="_blank" className='text-[16px] font-semibold'>here is my curriculum vitae</Link>
        </div>
        <div className='flex gap-6 items-center'>
          <Button>view the blog</Button>
          <Button className='bg-white text-black hover:text-white'>deploy the website</Button>
        </div>
      </section>
      <section className='w-dvw flex flex-col justify-center items-center gap-6 text-4xl font-bold'>
        <div className='max-sm:hidden'>What technologies does this website use</div>
        <div className='sm:hidden'>
          What technologies
        </div>
        <div className='sm:hidden'>
          does this website use
        </div>
        <div className="w-[80%] sm:w-[500px] overflow-hidden  ">
          <ExampleMarquee></ExampleMarquee>
        </div>
      </section>
      <section className='w-dvw flex flex-col justify-center items-center gap-6 mt-[120px] '>
        <span className='text-4xl font-bold '>My portfolio</span>
        <div className='grid gap-6  place-items-center'>
          <Link href='/imitation-x'>
            <Card className="rounded-2xl w-[80%] sm:w-[316px] hover:shadow-lg transition-shadow p-4  flex flex-col gap-2">
              <div className="relative w-[278px] h-[217px]">
                <Image
                  src="/mitate-x.png"
                  alt="Imitate the X"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <span data-value='title' className='text-xl font-bold'>Imitate X: A Social Platform with Supabase Auth & CURD</span>
              <span data-value="description">A Twitter-like demo where CURD operations and login permissions are implemented using Supabase.</span>
            </Card>
          </Link>
        </div>
      </section>

      <section className='w-dvw flex flex-col sm:flex-row gap-6 mt-[120px] mb-16 justify-center items-center '>
        <Image alt='logo' src='/logo.svg' width={200} height={200} className='cursor-pointer '></Image>
        <Link href={'/imitation-x'} className='text-5xl font-bold cursor-pointer '>Just for fun!!!</Link>
      </section>
      <section className='w-full flex flex-col items-center gap-6'>
        <span className='text-4xl font-bold '>
          My blog
        </span>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[80%]'>
          {getAllPosts().map(post => (
            <Link key={post.slug} href={'/blog/' + post.slug}>
              <Card suppressHydrationWarning>
                <CardContent>
                  <h2 className='text-xl font-bold'>{post.slug}</h2>
                  <div className='line-clamp-3 h-full  max-h-[128px] overflow-hidden' dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }}></div>
                </CardContent>
              </Card>
            </Link>
          ))}
          <Link href={'/imitation-x'}>
            <Card suppressHydrationWarning>
              <CardContent>
                <h2 className='text-xl font-bold'>添加博客</h2>
                <div
                  className='w-16 h-16 rounded-2xl mt-2 text-white bg-blue-400 flex justify-center items-center'>
                  <Plus className='font-bold ' />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
      <LandingPageFooter className='mt-[120px]'></LandingPageFooter>
    </div >
  )
}
