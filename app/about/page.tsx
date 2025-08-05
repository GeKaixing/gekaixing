// components/CookiePolicy.tsx

import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/towel/Navbar';

const CookiePolicy = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className="container mx-auto p-4 md:p-8">
        <Head>
          <title>关于 | Towel</title>
          <meta name="description" content="Towel 的 介绍。" />
        </Head>

        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Towel 的介绍</h1>
          <p className="text-sm text-gray-500 mb-8">
            更新日期：2025年8月4日
          </p>

          <p className="mb-4">
            本政策解释了 <strong>Towel</strong> 的内容以及用途。
          </p>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. 什么是 Towel</h2>
            <p className="mb-2">
              <strong>Towel</strong>仅供学习和教学使用，任何条款和政策无效。
            </p>
          </section>


        </div>
      </div>
    </>
  );
};

export default CookiePolicy;