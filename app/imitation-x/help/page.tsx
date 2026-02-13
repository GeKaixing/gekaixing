import React from 'react';
import Head from 'next/head';
import Navbar from '@/components/gekaixing/Navbar';
import Link from 'next/link';

interface HelpItemProps {
  question: string;
  answer: string;
}

const HelpItem = ({ question, answer }: HelpItemProps) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-2">{question}</h3>
    <p className="text-gray-600">{answer}</p>
  </div>
);

export default function HelpCenter() {
  const faqs: HelpItemProps[] = [
    {
      question: "如何注册账号？",
      answer: "点击页面右上角的登录按钮，选择注册选项，填写邮箱和密码即可完成注册。您也可以使用 Google 账号快速登录。"
    },
    {
      question: "如何发布动态？",
      answer: "登录后，在首页或个人主页点击输入框，输入您想分享的内容，然后点击发布按钮即可。您可以添加图片、表情等丰富您的动态。"
    },
    {
      question: "如何修改个人资料？",
      answer: "点击您的头像进入个人主页，点击编辑资料按钮可以修改昵称、头像、简介等个人信息。"
    },
    {
      question: "如何关注其他用户？",
      answer: "在您感兴趣的用户主页上，点击关注按钮即可关注该用户。您可以在关注列表中查看所有已关注的用户。"
    },
    {
      question: "如何私信其他用户？",
      answer: "访问对方的个人主页，点击私信按钮即可发起对话。您也可以在消息页面查看所有对话记录。"
    },
    {
      question: "如何举报不当内容？",
      answer: "点击动态右上角的更多选项，选择举报，填写举报原因并提交。我们会尽快审核处理。"
    }
  ];

  const guidelines = [
    {
      title: "社区规范",
      content: "请遵守社区规范，发布友善、积极的内容。禁止发布违法、暴力、色情、歧视等内容。"
    },
    {
      title: "隐私保护",
      content: "请保护好您的个人隐私，不要在公开场合分享敏感信息如身份证号、银行卡号等。"
    },
    {
      title: "账号安全",
      content: "请使用强密码并定期更换。不要将账号密码告诉他人，开启两步验证可以增加账号安全性。"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 md:p-8">
        <Head>
          <title>帮助中心 | Gekaixing</title>
          <meta name="description" content="Gekaixing 帮助中心，解答您的常见问题。" />
        </Head>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">帮助中心</h1>
          <p className="text-gray-500 mb-8">找到您需要的帮助和解答</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Link 
              href="#faq" 
              className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <h3 className="font-semibold text-blue-800 mb-2">常见问题</h3>
              <p className="text-sm text-blue-600">查看用户最常问的问题</p>
            </Link>
            <Link 
              href="#guidelines" 
              className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <h3 className="font-semibold text-green-800 mb-2">使用指南</h3>
              <p className="text-sm text-green-600">了解平台使用规范</p>
            </Link>
            <Link 
              href="#contact" 
              className="p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <h3 className="font-semibold text-purple-800 mb-2">联系我们</h3>
              <p className="text-sm text-purple-600">获取人工客服支持</p>
            </Link>
          </div>

          <section id="faq" className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b">常见问题</h2>
            {faqs.map((faq, index) => (
              <HelpItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </section>

          <section id="guidelines" className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b">使用指南</h2>
            {guidelines.map((item, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
              </div>
            ))}
          </section>

          <section id="contact" className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b">联系我们</h2>
            <p className="mb-4">
              如果您没有找到需要的帮助，可以通过以下方式联系我们：
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>电子邮件：<a href="mailto:support@gekaixing.com" className="text-blue-500 hover:underline">support@gekaixing.com</a></li>
              <li>客服时间：周一至周五 9:00-18:00</li>
              <li>通常在 24 小时内回复</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b">相关链接</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/tos" className="text-blue-500 hover:underline">服务条款</Link>
              <Link href="/privacy" className="text-blue-500 hover:underline">隐私政策</Link>
              <Link href="/about" className="text-blue-500 hover:underline">关于我们</Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
