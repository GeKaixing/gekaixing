// components/CookiePolicy.tsx

import React from 'react';
import Head from 'next/head';

const CookiePolicy = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Head>
        <title>Cookie 使用政策 | Towel</title>
        <meta name="description" content="Towel 的 Cookie 使用政策，说明我们如何使用 Cookie 以及用户如何管理偏好。" />
      </Head>

      <div className="prose max-w-none">
        <h1 className="text-3xl font-bold mb-6">Towel Cookie 使用政策</h1>
        <p className="text-sm text-gray-500 mb-8">
          更新日期：2025年8月4日
        </p>

        <p className="mb-4">
          本政策解释了 <strong>Towel</strong> 如何在您的设备上使用 Cookie 和其他类似技术。通过继续使用我们的网站，即表示您同意我们根据本政策使用 Cookie。
        </p>

        <hr className="my-8" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. 什么是 Cookie？</h2>
          <p className="mb-2">
            Cookie 是您访问网站时，由网站发送并存储在您的浏览器中的小文本文件。这些文件包含了少量信息，可以帮助网站记住您的偏好、登录状态、购物车中的商品以及其他设置，从而提升您的浏览体验。
          </p>
        </section>

        <hr className="my-8" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. 我们如何使用 Cookie？</h2>
          <p className="mb-2">
            我们使用不同类型的 Cookie 来实现以下目的：
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>必需的 Cookie</strong>：这些 Cookie 对于网站的正常运行至关重要。它们让您可以浏览网站、使用购物车以及进行安全的交易。没有这些 Cookie，网站的某些功能可能无法使用。</li>
            <li><strong>功能性 Cookie</strong>：这些 Cookie 帮助我们记住您的偏好（例如，语言或地区设置），为您提供更个性化的体验。</li>
            <li><strong>性能与分析性 Cookie</strong>：我们使用这些 Cookie 来收集关于您如何使用我们网站的信息，例如您访问了哪些页面、点击了哪些链接以及是否有错误发生。这些数据以匿名形式收集，用于分析和改进网站的性能。</li>
            <li><strong>广告与定位性 Cookie</strong>：这些 Cookie 用于记录您的浏览习惯，以向您展示我们认为您可能感兴趣的广告。它们也用于限制广告展示的次数，并评估广告活动的有效性。</li>
          </ul>
        </section>

        <hr className="my-8" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. 第三方 Cookie</h2>
          <p className="mb-2">
            我们的网站可能会使用由第三方（例如，Google Analytics、广告合作伙伴）设置的 Cookie。这些第三方可能会收集您的浏览信息，用于分析或提供个性化广告。我们无法控制这些第三方 Cookie，它们的具体用途受其各自的隐私政策管辖。
          </p>
        </section>

        <hr className="my-8" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. 如何管理您的 Cookie 偏好？</h2>
          <p className="mb-2">
            您有权接受或拒绝 Cookie。大多数浏览器默认接受 Cookie，但您可以通过更改浏览器设置来管理或拒绝它们。请注意，如果您选择禁用 Cookie，网站的某些功能可能会受到影响，您的用户体验也可能不如预期。
          </p>
          <p>
            有关如何管理浏览器中 Cookie 的更多信息，您可以访问浏览器的帮助页面。
          </p>
        </section>
        
        <hr className="my-8" />

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. 联系我们</h2>
          <p>
            如果您对我们的 Cookie 使用政策有任何疑问，请通过以下方式联系我们：<br />
            电子邮件：<a href="mailto:privacy@towel.com" className="text-blue-500 hover:underline">privacy@towel.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicy;