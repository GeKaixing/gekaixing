// components/PrivacyPolicy.tsx

import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/towel/Navbar';

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar></Navbar>
      <div className="container mx-auto p-4 md:p-8">
        <Head>
          <title>隐私政策 | Towel</title>
          <meta name="description" content="Towel 的隐私政策，说明我们如何收集、使用和保护您的个人信息。" />
        </Head>

        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Towel 隐私政策</h1>
          <p className="text-sm text-gray-500 mb-8">
            更新日期：2025年8月4日
          </p>

          <p className="mb-4">
            我们重视您的隐私。本隐私政策旨在解释我们如何收集、使用、披露和保护您在使用我们的网站 <strong>Towel</strong>
            时提供给我们的信息。通过访问或使用我们的网站，即表示您同意本政策的条款。
          </p>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. 我们收集的信息</h2>
            <p className="mb-2">
              我们可能会收集您的以下个人信息：
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>个人身份信息</strong>：当您注册、下单或填写表格时，我们可能会收集您的姓名、电子邮件地址、电话号码、送货地址和账单地址。</li>
              <li><strong>支付信息</strong>：当您进行购买时，我们通过安全的第三方支付处理服务商（例如：Stripe, PayPal）收集和处理您的支付信息。我们不会存储您的信用卡信息。</li>
              <li><strong>非个人身份信息</strong>：我们可能会自动收集非个人身份信息，例如您的 IP 地址、浏览器类型、操作系统、访问时间以及您在我们网站上浏览过的页面。这些信息用于分析网站流量和改进用户体验。</li>
            </ul>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. 我们如何使用您的信息</h2>
            <p className="mb-2">
              我们使用收集到的信息来：
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>处理您的订单和付款，并交付您购买的产品。</li>
              <li>向您发送订单状态更新、发货通知和客户服务沟通。</li>
              <li>个性化您的网站体验，并改进我们的产品和服务。</li>
              <li>在您同意的情况下，向您发送营销和促销邮件（您可以随时选择退订）。</li>
              <li>维护网站的安全和完整性，防止欺诈行为。</li>
            </ul>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. 信息共享与披露</h2>
            <p className="mb-2">
              我们承诺不会出售或出租您的个人信息。在以下情况下，我们可能会与第三方共享您的信息：
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>服务提供商</strong>：我们可能会与协助我们运营业务的第三方服务提供商共享您的信息，例如送货公司、支付处理商和营销服务。这些第三方仅在提供服务所需的范围内访问您的信息。</li>
              <li><strong>法律要求</strong>：如果法律要求、法院传票或政府调查需要，我们可能会披露您的信息。</li>
              <li><strong>业务转让</strong>：如果 <strong>Towel</strong> 被收购或合并，您的信息可能会作为资产的一部分进行转让。</li>
            </ul>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Cookie 和跟踪技术</h2>
            <p className="mb-2">
              我们使用 Cookie 和类似技术来增强您的浏览体验、记住您的偏好、分析网站流量和提供个性化广告。您可以通过浏览器设置拒绝 Cookie，但这可能会影响网站的某些功能。
            </p>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. 信息安全</h2>
            <p className="mb-2">
              我们采取合理的物理、电子和管理措施来保护您的个人信息，防止未经授权的访问、使用或披露。尽管如此，请注意，没有一种互联网传输或电子存储方法是完全安全的。
            </p>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. 您的权利</h2>
            <p className="mb-2">
              您可以随时通过联系我们来访问、更正或删除您的个人信息。如果您对我们如何处理您的数据有疑问或顾虑，请随时联系我们。
            </p>
          </section>

          <hr className="my-8" />

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. 联系我们</h2>
            <p>
              如果您对本隐私政策有任何疑问，请通过以下方式联系我们：<br />
              电子邮件：<a href="mailto:privacy@towel.com" className="text-blue-500 hover:underline">privacy@towel.com</a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;