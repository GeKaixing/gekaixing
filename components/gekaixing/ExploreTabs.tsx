"use client"
import  { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'
import { ChartNoAxesColumn } from 'lucide-react'
import NEWs from './NEWs'
export async function ToutiaoHotGTE() {
    return await fetch('https://dabenshi.cn/other/api/hot.php?type=toutiaoHot', {
        method: 'GET',
        next: {
            revalidate: 60
        },
        cache: 'force-cache'
    })
}

export default
    function ExploreTabs() {
    const [data, setData] = useState([])
    useEffect(() => {
        async function fetchf() {
            try {
                const reslut = await ToutiaoHotGTE()
                const data = await reslut.json()
                if (data.success) {
                    setData(data.data)
                }
            } catch (error){
                console.log(error)
                setData([])
            }
        }
        fetchf()
    }, [])
    return <Tabs defaultValue="ToutiaoHot" className="w-full mt-2">
        <TabsList className='w-full flex justify-between bg-muted/60'>
            <TabsTrigger value="ToutiaoHot">今日头条</TabsTrigger>
            <TabsTrigger value="us">美国</TabsTrigger>
            <TabsTrigger value="techcrunch">科技</TabsTrigger>
            <TabsTrigger value="sports">体育</TabsTrigger>
            <TabsTrigger value="entertainment">娱乐</TabsTrigger>
        </TabsList>
        <TabsContent value="ToutiaoHot" className='mt-3'>
            {data.length !== 0 && data.map((item: { url: string, title: string, hot_value: string }, idx: number) => (
                <Link
                    href={item.url}
                    key={idx}
                    className="flex flex-col justify-start rounded-2xl p-2 py-1 transition-colors hover:bg-muted/60"
                >
                    <span className='text-foreground'>{item.title}</span>
                    <div className='flex items-center gap-1 text-muted-foreground'>
                        <ChartNoAxesColumn className='h-4 w-4' /> <span>{item.hot_value}</span>
                    </div>
                </Link>
            ))}
        </TabsContent>
        <TabsContent value="us">
            <NEWs url={`/api/news/news-us`}></NEWs>
        </TabsContent>
        <TabsContent value="techcrunch">
            <NEWs url={`/api/news/news-techcrunch`}></NEWs>
        </TabsContent>
        <TabsContent value="sports">
            <NEWs url={`/api/news/news-sports`}></NEWs>
        </TabsContent>
        <TabsContent value="entertainment">
            <NEWs url={`/api/news/news-entertainment`}></NEWs>
        </TabsContent>
    </Tabs>
}
