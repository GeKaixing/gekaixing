'use client'; // 确保这是一个客户端组件，以便使用 Hooks

import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import Link from 'next/link';

export default function BlogSearch({ data }: { data: Array<{ slug: string, content: string }> }) {
    // 1. 使用 useState 来管理搜索词
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState<Array<{ slug: string, content: string }>>([]);
    useEffect(() => {
        // 2. 根据搜索词筛选数据
        if (searchTerm === '') { setFilteredData([]); return; }
        const filteredData = data.filter(item =>
            // 将搜索词和内容都转为小写，以便进行不区分大小写的匹配
            item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filteredData.length > 0) {
            setFilteredData(filteredData)
        }
    }, [searchTerm])



    return (
        <div className='w-1/2 mb-6 mx-auto'>
            {/* 搜索输入框 */}
            <form className='mb-6'>
                <Input
                    placeholder="搜索文章..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </form>

            {/* 搜索结果列表 */}
            <div>
                {/* 如果有搜索结果，则进行渲染 */}
                {filteredData.length > 0 && (
                    filteredData.map(item => (
                        <Link href={'/blog/' + item.slug} key={item.slug}>
                            <div  className="p-4 mb-2 bg-gray-100 rounded-md shadow-sm">
                                < div className="font-bold text-lg">{item.slug}</div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div >
    );
}