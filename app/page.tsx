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
export default function page() {
  return (
    <div className='bg-[#e9e9e9] px-6 flex flex-col justify-center items-center'>
      <Navbar></Navbar>
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
          <motion.div
            animate={{ x: -100 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            className="flex flex-row gap-6 w-[50%] sm:w-[700px] items-center"
          >
            <svg aria-label="Next.js 标识" height="18" role="img" viewBox="0 0 394 79"><path d="M261.919 0.0330722H330.547V12.7H303.323V79.339H289.71V12.7H261.919V0.0330722Z" fill="var(--geist-foreground)"></path><path d="M149.052 0.0330722V12.7H94.0421V33.0772H138.281V45.7441H94.0421V66.6721H149.052V79.339H80.43V12.7H80.4243V0.0330722H149.052Z" fill="var(--geist-foreground)"></path><path d="M183.32 0.0661486H165.506L229.312 79.3721H247.178L215.271 39.7464L247.127 0.126654L229.312 0.154184L206.352 28.6697L183.32 0.0661486Z" fill="var(--geist-foreground)"></path><path d="M201.6 56.7148L192.679 45.6229L165.455 79.4326H183.32L201.6 56.7148Z" fill="var(--geist-foreground)"></path><path clipRule="evenodd" d="M80.907 79.339L17.0151 0H0V79.3059H13.6121V16.9516L63.8067 79.339H80.907Z" fill="var(--geist-foreground)" fillRule="evenodd"></path><path d="M333.607 78.8546C332.61 78.8546 331.762 78.5093 331.052 77.8186C330.342 77.1279 329.991 76.2917 330 75.3011C329.991 74.3377 330.342 73.5106 331.052 72.8199C331.762 72.1292 332.61 71.7838 333.607 71.7838C334.566 71.7838 335.405 72.1292 336.115 72.8199C336.835 73.5106 337.194 74.3377 337.204 75.3011C337.194 75.9554 337.028 76.5552 336.696 77.0914C336.355 77.6368 335.922 78.064 335.377 78.373C334.842 78.6911 334.252 78.8546 333.607 78.8546Z" fill="var(--geist-foreground)"></path><path d="M356.84 45.4453H362.872V68.6846C362.863 70.8204 362.401 72.6472 361.498 74.1832C360.585 75.7191 359.321 76.8914 357.698 77.7185C356.084 78.5364 354.193 78.9546 352.044 78.9546C350.079 78.9546 348.318 78.6001 346.75 77.9094C345.182 77.2187 343.937 76.1826 343.024 74.8193C342.101 73.456 341.649 71.7565 341.649 69.7207H347.691C347.7 70.6114 347.903 71.3838 348.29 72.0291C348.677 72.6744 349.212 73.1651 349.895 73.5105C350.586 73.8559 351.38 74.0286 352.274 74.0286C353.243 74.0286 354.073 73.8286 354.746 73.4196C355.419 73.0197 355.936 72.4199 356.296 71.6201C356.646 70.8295 356.831 69.8479 356.84 68.6846V45.4453Z" fill="var(--geist-foreground)"></path><path d="M387.691 54.5338C387.544 53.1251 386.898 52.0254 385.773 51.2438C384.638 50.4531 383.172 50.0623 381.373 50.0623C380.11 50.0623 379.022 50.2532 378.118 50.6258C377.214 51.0075 376.513 51.5164 376.033 52.1617C375.554 52.807 375.314 53.5432 375.295 54.3703C375.295 55.061 375.461 55.6608 375.784 56.1607C376.107 56.6696 376.54 57.0968 377.103 57.4422C377.656 57.7966 378.274 58.0874 378.948 58.3237C379.63 58.56 380.313 58.76 380.995 58.9236L384.14 59.6961C385.404 59.9869 386.631 60.3778 387.802 60.8776C388.973 61.3684 390.034 61.9955 390.965 62.7498C391.897 63.5042 392.635 64.413 393.179 65.4764C393.723 66.5397 394 67.7848 394 69.2208C394 71.1566 393.502 72.8562 392.496 74.3285C391.491 75.7917 390.043 76.9369 388.143 77.764C386.252 78.582 383.965 79 381.272 79C378.671 79 376.402 78.6002 374.493 77.8004C372.575 77.0097 371.08 75.8463 370.001 74.3194C368.922 72.7926 368.341 70.9294 368.258 68.7391H374.235C374.318 69.8842 374.687 70.8386 375.314 71.6111C375.95 72.3745 376.78 72.938 377.795 73.3197C378.819 73.6923 379.962 73.8832 381.226 73.8832C382.545 73.8832 383.707 73.6832 384.712 73.2924C385.708 72.9016 386.492 72.3564 387.055 71.6475C387.627 70.9476 387.913 70.1206 387.922 69.1754C387.913 68.312 387.654 67.5939 387.156 67.0304C386.649 66.467 385.948 65.9944 385.053 65.6127C384.15 65.231 383.098 64.8856 381.899 64.5857L378.081 63.6223C375.323 62.9225 373.137 61.8592 371.541 60.4323C369.937 59.0054 369.143 57.115 369.143 54.7429C369.143 52.798 369.678 51.0894 370.758 49.6261C371.827 48.1629 373.294 47.0268 375.148 46.2179C377.011 45.4 379.114 45 381.456 45C383.836 45 385.92 45.4 387.719 46.2179C389.517 47.0268 390.929 48.1538 391.952 49.5897C392.976 51.0257 393.511 52.6707 393.539 54.5338H387.691Z" fill="var(--geist-foreground)"></path></svg>
            <Image src={'/supabase-logo-wordmark--light.webp'} width={84} height={84} alt='logo'></Image>
            <div className='text-xl'>shadcn/ui</div>
            <svg viewBox="0 0 167 21" fill="none" className="h-5 text-black dark:text-white"><path className="fill-sky-400" d="M17.183 0C12.6 0 9.737 2.291 8.59 6.873c1.719-2.29 3.723-3.15 6.014-2.577 1.307.326 2.242 1.274 3.275 2.324 1.685 1.71 3.635 3.689 7.894 3.689 4.582 0 7.445-2.291 8.591-6.872-1.718 2.29-3.723 3.15-6.013 2.576-1.308-.326-2.243-1.274-3.276-2.324C23.39 1.98 21.44 0 17.183 0ZM8.59 10.309C4.01 10.309 1.145 12.6 0 17.182c1.718-2.291 3.723-3.15 6.013-2.577 1.308.326 2.243 1.274 3.276 2.324 1.685 1.71 3.635 3.689 7.894 3.689 4.582 0 7.445-2.29 8.59-6.872-1.718 2.29-3.722 3.15-6.013 2.577-1.307-.327-2.242-1.276-3.276-2.325-1.684-1.71-3.634-3.689-7.893-3.689Z"></path><path fill="currentColor" d="M51.547 8.688h-3v5.803c0 1.548 1.016 1.524 3 1.427v2.346c-4.015.483-5.611-.629-5.611-3.773V8.688H43.71V6.172h2.225V2.925l2.612-.774v4.021h2.998v2.516Zm11.43-2.516h2.61v12.092h-2.61v-1.741c-.92 1.28-2.346 2.055-4.233 2.055-3.288 0-6.021-2.78-6.021-6.36 0-3.603 2.733-6.36 6.021-6.36 1.886 0 3.313.774 4.233 2.032V6.172Zm-3.821 9.915c2.176 0 3.82-1.62 3.82-3.87 0-2.248-1.644-3.868-3.82-3.868-2.177 0-3.821 1.62-3.821 3.869s1.644 3.87 3.82 3.87ZM69.94 4.36a1.687 1.687 0 0 1-1.668-1.669c.002-.443.179-.868.491-1.18a1.662 1.662 0 0 1 2.354 0c.312.312.49.737.491 1.18 0 .895-.75 1.669-1.668 1.669Zm-1.306 13.905V6.172h2.612v12.092h-2.612Zm5.635 0V.609h2.611v17.654H74.27ZM93.834 6.172h2.757l-3.797 12.092h-2.563l-2.516-8.15-2.539 8.15h-2.563L78.816 6.172h2.757l2.346 8.343 2.54-8.343h2.49l2.514 8.343 2.37-8.343ZM99.83 4.36c-.92 0-1.669-.774-1.669-1.669.002-.443.18-.868.492-1.18a1.661 1.661 0 0 1 2.354 0c.313.312.49.737.492 1.18 0 .895-.75 1.669-1.669 1.669Zm-1.306 13.905V6.172h2.612v12.092h-2.612ZM110.52 5.858c2.708 0 4.643 1.838 4.643 4.982v7.423h-2.612v-7.158c0-1.838-1.064-2.804-2.708-2.804-1.717 0-3.071 1.015-3.071 3.482v6.48h-2.612V6.174h2.612V7.72c.798-1.257 2.103-1.862 3.748-1.862Zm17.024-4.522h2.612v16.927h-2.612v-1.741c-.918 1.282-2.345 2.055-4.231 2.055-3.289 0-6.022-2.78-6.022-6.36 0-3.603 2.733-6.36 6.022-6.36 1.886 0 3.313.774 4.231 2.032V1.336Zm-3.821 14.751c2.177 0 3.821-1.62 3.821-3.87 0-2.248-1.644-3.868-3.821-3.868-2.176 0-3.82 1.62-3.82 3.869s1.644 3.87 3.82 3.87Zm15.187 2.49c-3.651 0-6.384-2.78-6.384-6.36 0-3.602 2.733-6.359 6.384-6.359 2.37 0 4.426 1.233 5.393 3.12l-2.249 1.306c-.532-1.137-1.717-1.863-3.168-1.863-2.128 0-3.748 1.62-3.748 3.797 0 2.176 1.62 3.797 3.748 3.797 1.451 0 2.636-.75 3.216-1.863l2.249 1.282c-1.015 1.91-3.071 3.144-5.441 3.144Zm9.746-9.068c0 2.201 6.505.87 6.505 5.345 0 2.419-2.104 3.724-4.716 3.724-2.418 0-4.159-1.089-4.933-2.83l2.249-1.305c.387 1.088 1.355 1.74 2.684 1.74 1.161 0 2.056-.386 2.056-1.354 0-2.151-6.505-.942-6.505-5.27 0-2.274 1.959-3.701 4.425-3.701 1.983 0 3.628.92 4.474 2.515l-2.2 1.233c-.436-.943-1.283-1.378-2.274-1.378-.943 0-1.765.41-1.765 1.281Zm11.148 0c0 2.201 6.505.87 6.505 5.345 0 2.419-2.104 3.724-4.716 3.724-2.418 0-4.158-1.089-4.933-2.83l2.249-1.305c.387 1.088 1.354 1.74 2.684 1.74 1.161 0 2.056-.386 2.056-1.354 0-2.151-6.505-.942-6.505-5.27 0-2.274 1.959-3.701 4.426-3.701 1.982 0 3.627.92 4.473 2.515l-2.2 1.233c-.435-.943-1.282-1.378-2.273-1.378-.944 0-1.766.41-1.766 1.281Z"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" id="lucide-logo">
              <path d="M14 12C14 9.79086 12.2091 8 10 8C7.79086 8 6 9.79086 6 12C6 16.4183 9.58172 20 14 20C18.4183 20 22 16.4183 22 12C22 8.446 20.455 5.25285 18 3.05557" stroke="#2D3748" />
              <path d="M10 12C10 14.2091 11.7909 16 14 16C16.2091 16 18 14.2091 18 12C18 7.58172 14.4183 4 10 4C5.58172 4 2 7.58172 2 12C2 15.5841 3.57127 18.8012 6.06253 21" stroke="#F56565" />
            </svg>
            <svg aria-label="Vercel Logo" fill="var(--geist-foreground)" viewBox="0 0 75 65" height="18"><path d="M37.59.25l36.95 64H.64l36.95-64z"></path></svg>
            <svg viewBox="0 0 105 36" role="img" width="105px" height="41px" aria-hidden="true"><path fill="#000" d="M11.679 26.754h2.353v6.423h4.111v2.06H11.68v-8.483zM20.58 31.02v-.024c0-2.436 1.965-4.412 4.584-4.412 2.62 0 4.56 1.951 4.56 4.387v.025c0 2.436-1.965 4.41-4.584 4.41-2.618 0-4.56-1.95-4.56-4.386zm6.743 0v-.024c0-1.223-.885-2.291-2.183-2.291-1.285 0-2.147 1.042-2.147 2.266v.025c0 1.222.886 2.29 2.171 2.29 1.298 0 2.159-1.042 2.159-2.266zM32.604 31.517v-4.763h2.389v4.714c0 1.223.618 1.806 1.564 1.806.946 0 1.564-.557 1.564-1.745v-4.775h2.39v4.7c0 2.74-1.564 3.939-3.978 3.939s-3.93-1.223-3.93-3.878M44.112 26.755h3.274c3.032 0 4.79 1.744 4.79 4.192v.025c0 2.447-1.782 4.265-4.838 4.265h-3.226v-8.483zm3.31 6.397c1.408 0 2.34-.775 2.34-2.146v-.024c0-1.357-.932-2.145-2.34-2.145h-.958v4.316l.959-.001zM55.596 26.754h6.791v2.06h-4.438v1.442h4.014v1.951h-4.014v3.03h-2.353v-8.483zM65.661 26.754h2.353v6.423h4.111v2.06h-6.464v-8.483zM78.273 26.693h2.268l3.614 8.544h-2.522l-.62-1.515H77.74l-.606 1.515h-2.474l3.614-8.544zm2.062 5.2l-.946-2.413-.959 2.412h1.905zM87.186 26.754H91.2c1.298 0 2.195.34 2.765.921.498.485.752 1.14.752 1.976v.024c0 1.296-.693 2.156-1.746 2.605l2.025 2.957H92.28l-1.71-2.57h-1.03v2.57h-2.353v-8.483zm3.905 4.072c.8 0 1.262-.388 1.262-1.006v-.024c0-.667-.486-1.006-1.275-1.006h-1.54v2.038l1.553-.002zM98.112 26.754h6.827v2h-4.498v1.284h4.075v1.854h-4.075v1.346H105v1.999h-6.888v-8.483zM6.528 32.014c-.33.744-1.023 1.272-1.944 1.272-1.286 0-2.171-1.067-2.171-2.29v-.025c0-1.223.86-2.266 2.146-2.266.97 0 1.708.595 2.02 1.406h2.48c-.398-2.02-2.173-3.526-4.475-3.526-2.62 0-4.584 1.977-4.584 4.41v.024c0 2.436 1.94 4.388 4.56 4.388 2.24 0 3.991-1.45 4.453-3.393H6.528z"></path><path d="M89.012 22.355l.257-.887c.306-1.056.192-2.031-.321-2.748-.472-.66-1.259-1.049-2.214-1.094l-18.096-.229a.358.358 0 01-.285-.151.367.367 0 01-.04-.326.481.481 0 01.42-.321l18.263-.232c2.166-.099 4.512-1.856 5.333-3.998L93.37 9.65a.659.659 0 00.028-.36C92.216 3.975 87.468 0 81.792 0c-5.23 0-9.67 3.373-11.263 8.061a5.34 5.34 0 00-3.756-1.039 5.356 5.356 0 00-4.637 6.644c-4.099.12-7.386 3.475-7.386 7.6 0 .368.028.735.082 1.1a.354.354 0 00.348.305l33.408.004h.009a.44.44 0 00.415-.32z" fill="#F6821F"></path><path d="M95.04 9.847c-.167 0-.334.004-.5.013a.28.28 0 00-.079.017.285.285 0 00-.182.192l-.712 2.456c-.305 1.055-.192 2.03.322 2.746.471.661 1.258 1.05 2.213 1.094l3.858.232a.351.351 0 01.275.149.365.365 0 01.041.328.484.484 0 01-.42.32l-4.008.232c-2.176.1-4.521 1.856-5.342 3.998l-.29.756a.212.212 0 00.095.262c.03.017.062.027.096.028h13.802a.366.366 0 00.356-.265 9.846 9.846 0 00.367-2.677c-.001-5.457-4.429-9.88-9.891-9.88z" fill="#FBAD41"></path></svg>
          </motion.div>
        </div>
      </section>
      <section className='w-dvw flex flex-col justify-center items-center gap-6 mt-[120px] '>
        <span className='text-4xl font-bold max-sm:hidden'>
          What functions does this website have
        </span>
        <div className='sm:hidden text-4xl font-bold '>
          What functions does
        </div>
        <div className='sm:hidden text-4xl font-bold '>
          this website have
        </div>
        <div className='grid gap-6 grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 place-content-center'>
          
          <div className="rounded-2xl w-[80%] sm:w-[316px]  p-4 border-2 border-gray-400 flex flex-col gap-2">
            <div className='w-full h-full'>
              <Image className='w-[278px] h-[217px]' src='/test.jpg' width={64} height={64} alt='text' ></Image>
            </div>
            <span className='text-xl font-bold'>autority to login</span>
            <span>The CURD login permission was completed using supabase</span>
          </div>

          <div className="rounded-2xl w-[80%]  sm:w-[316px] p-4 border-2 border-gray-400 flex flex-col gap-2">
            <div className='w-full h-full'>
              <Image className='w-[278px] h-[217px]' src='/test.jpg' width={64} height={64} alt='text' ></Image>
            </div>
            <span className='text-xl font-bold'>First and second-level comments</span>
            <span>Implement a comment system similar to X</span>
          </div>

          <div className="rounded-2xl w-[80%] sm:w-[316px] p-4 border-2 border-gray-400 flex flex-col gap-2">
            <div className='w-full h-full'>
              <Image className='w-[278px] h-[217px]' src='/test.jpg' width={64} height={64} alt='text' ></Image>
            </div>
            <span className='text-xl font-bold'>Completely open source</span>
            <span>Go to github to view the code</span>
          </div>
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
              <Card >
                <CardContent>
                  <h2 className='text-xl font-bold'>{post.slug}</h2>
                  <div className='line-clamp-3 h-full  max-h-[128px] overflow-hidden' dangerouslySetInnerHTML={{ __html: marked.parse(post.content) }}></div>
                </CardContent>
              </Card>
            </Link>
          ))}
          <Link href={'/imitation-x'}>
            <Card>
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
