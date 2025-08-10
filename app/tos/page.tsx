// components/TermsOfService.tsx

import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/gekaixing/Navbar';

const TermsOfService = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className="container mx-auto p-4 md:p-8">
        <Head>
          <title>服务条款 | Gekaixing</title>
          <meta name="description" content="Gekaixing 网站的服务条款，包括使用协议、用户责任、知识产权等内容。" />
        </Head>

        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Gekaixing 服务条款</h1>
          <p className="text-sm text-gray-500 mb-8">
            更新日期：2025年8月4日
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. 协议接受</h2>
            <p className="mb-2">
              欢迎使用 Gekaixing！本服务条款（以下简称“本协议”）是您与 <strong>Gekaixing</strong>
              之间达成的法律协议，用于规范您对我们提供的所有服务、网站（以下简称“服务”）的使用。
              这些服务可能包括但不限于毛巾的展示、购买、评价以及相关内容。
              通过访问或使用我们的服务，即表示您已阅读、理解并同意遵守本协议的所有条款和条件。如果您不同意本协议的任何部分，请立即停止使用我们的服务。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. 服务的使用</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>您必须年满 [例如：18] 周岁才能购买我们的产品。</li>
              <li>您同意仅出于合法目的使用本服务，并遵守所有适用的法律法规。</li>
              <li>您在使用本服务时对所有评论、上传内容和行为负全部责任。</li>
              <li>我们保留在不事先通知的情况下，修改、暂停或终止任何服务的权利。</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. 用户账户与购物</h2>
            <p className="mb-2">
              为了方便购物和管理订单，您可能需要创建一个用户账户。您有责任保护您的账户信息的安全，并对您账户下发生的所有活动负责。
              所有通过您账户进行的购买行为均被视为您的授权行为。如果您发现未经授权使用您账户的情况，请立即通知我们。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. 知识产权</h2>
            <p className="mb-2">
              本服务及其所有内容（包括但不限于网站设计、毛巾图片、产品描述和软件）均受版权、商标和其他知识产权法的保护，归 <strong>Gekaixing</strong> 或其许可方所有。未经我们事先书面许可，您不得以任何方式复制、修改、分发、出售或出租服务的任何部分。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. 免责声明与责任限制</h2>
            <p className="mb-2">
              我们的服务按“现状”和“可用”基础提供，不提供任何形式的明示或暗示保证。尽管我们努力确保产品信息的准确性，但我们不对因您购买和使用毛巾产品而产生的任何直接、间接或附带损害负责。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. 协议的终止</h2>
            <p className="mb-2">
              您可以在任何时候通过停止使用服务来终止本协议。我们保留在任何时候以任何理由（包括但不限于您违反本协议）终止或暂停您访问服务的权利，无需事先通知。
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. 联系我们</h2>
            <p>
              如果您对本服务条款有任何疑问，请通过以下方式联系我们：<br />
              电子邮件：<a href="mailto:contact@Gekaixing.com" className="text-blue-500 hover:underline">contact@Gekaixing.com</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;