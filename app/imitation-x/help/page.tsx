import Navbar from "@/components/gekaixing/Navbar"
import Link from "next/link"
import { getLocale } from "next-intl/server"

interface HelpItem {
  question: string
  answer: string
}

interface GuideItem {
  title: string
  content: string
}

type HelpCopy = {
  pageTitle: string
  pageDesc: string
  heroTitle: string
  heroSubTitle: string
  cards: {
    faqTitle: string
    faqDesc: string
    guideTitle: string
    guideDesc: string
    contactTitle: string
    contactDesc: string
  }
  sectionTitles: {
    faq: string
    guide: string
    contact: string
    links: string
  }
  contactIntro: string
  contactItems: string[]
  relatedLinks: {
    tos: string
    privacy: string
    about: string
  }
  faqs: HelpItem[]
  guides: GuideItem[]
}

function getHelpCopy(locale: string): HelpCopy {
  if (locale === "zh-CN") {
    return {
      pageTitle: "帮助中心 | Gekaixing",
      pageDesc: "Gekaixing 帮助中心，解答您的常见问题。",
      heroTitle: "帮助中心",
      heroSubTitle: "找到您需要的帮助和解答",
      cards: {
        faqTitle: "常见问题",
        faqDesc: "查看用户最常问的问题",
        guideTitle: "使用指南",
        guideDesc: "了解平台使用规范",
        contactTitle: "联系我们",
        contactDesc: "获取人工客服支持",
      },
      sectionTitles: {
        faq: "常见问题",
        guide: "使用指南",
        contact: "联系我们",
        links: "相关链接",
      },
      contactIntro: "如果您没有找到需要的帮助，可以通过以下方式联系我们：",
      contactItems: [
        "电子邮件：support@gekaixing.com",
        "客服时间：周一至周五 9:00-18:00",
        "通常在 24 小时内回复",
      ],
      relatedLinks: {
        tos: "服务条款",
        privacy: "隐私政策",
        about: "关于我们",
      },
      faqs: [
        {
          question: "如何注册账号？",
          answer:
            "点击页面右上角的登录按钮，选择注册选项，填写邮箱和密码即可完成注册。您也可以使用 Google 账号快速登录。",
        },
        {
          question: "如何发布动态？",
          answer:
            "登录后，在首页或个人主页点击输入框，输入您想分享的内容，然后点击发布按钮即可。您可以添加图片、表情等丰富您的动态。",
        },
        {
          question: "如何修改个人资料？",
          answer:
            "点击您的头像进入个人主页，点击编辑资料按钮可以修改昵称、头像、简介等个人信息。",
        },
        {
          question: "如何关注其他用户？",
          answer:
            "在您感兴趣的用户主页上，点击关注按钮即可关注该用户。您可以在关注列表中查看所有已关注的用户。",
        },
        {
          question: "如何私信其他用户？",
          answer:
            "访问对方的个人主页，点击私信按钮即可发起对话。您也可以在消息页面查看所有对话记录。",
        },
      ],
      guides: [
        {
          title: "社区规范",
          content: "请遵守社区规范，发布友善、积极的内容。禁止发布违法、暴力、色情、歧视等内容。",
        },
        {
          title: "隐私保护",
          content: "请保护好您的个人隐私，不要在公开场合分享敏感信息如身份证号、银行卡号等。",
        },
        {
          title: "账号安全",
          content: "请使用强密码并定期更换。不要将账号密码告诉他人，开启两步验证可以增加账号安全性。",
        },
      ],
    }
  }

  return {
    pageTitle: "Help Center | Gekaixing",
    pageDesc: "Gekaixing Help Center for common questions and guidance.",
    heroTitle: "Help Center",
    heroSubTitle: "Find the support and answers you need",
    cards: {
      faqTitle: "FAQs",
      faqDesc: "Most common user questions",
      guideTitle: "Guidelines",
      guideDesc: "Platform usage guidance",
      contactTitle: "Contact Us",
      contactDesc: "Reach our support team",
    },
    sectionTitles: {
      faq: "Frequently Asked Questions",
      guide: "Guidelines",
      contact: "Contact",
      links: "Related Links",
    },
    contactIntro: "If you still need help, please contact us via:",
    contactItems: [
      "Email: support@gekaixing.com",
      "Support hours: Monday to Friday 9:00-18:00",
      "Usually replies within 24 hours",
    ],
    relatedLinks: {
      tos: "Terms of Service",
      privacy: "Privacy Policy",
      about: "About Us",
    },
    faqs: [
      {
        question: "How do I sign up?",
        answer:
          "Click the login button in the top-right corner, choose sign up, then fill in email and password. You can also sign in with Google.",
      },
      {
        question: "How can I post updates?",
        answer:
          "After login, use the input box on home or profile page, type your content and click publish. You can also add images and emojis.",
      },
      {
        question: "How do I edit my profile?",
        answer:
          "Open your profile by clicking your avatar, then click edit profile to update nickname, avatar and bio.",
      },
      {
        question: "How do I follow users?",
        answer:
          "Open the profile you are interested in and click follow. You can check all followed users in your following list.",
      },
      {
        question: "How can I send private messages?",
        answer:
          "Open the target user's profile and click message to start a conversation. You can review all conversations in the chat page.",
      },
    ],
    guides: [
      {
        title: "Community Rules",
        content:
          "Please keep content friendly and positive. Illegal, violent, explicit or discriminatory content is not allowed.",
      },
      {
        title: "Privacy",
        content:
          "Protect your personal information and avoid sharing sensitive details like ID numbers or bank cards publicly.",
      },
      {
        title: "Account Security",
        content:
          "Use strong passwords and update them regularly. Do not share credentials. Enabling 2FA improves account safety.",
      },
    ],
  }
}

export default async function HelpCenter() {
  const locale = await getLocale()
  const copy = getHelpCopy(locale)

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{copy.heroTitle}</h1>
          <p className="text-muted-foreground mb-8">{copy.heroSubTitle}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Link href="#faq" className="p-6 bg-blue-50/80 dark:bg-blue-950/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/35 transition-colors border border-blue-100 dark:border-blue-900/40">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">{copy.cards.faqTitle}</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">{copy.cards.faqDesc}</p>
            </Link>
            <Link href="#guidelines" className="p-6 bg-green-50/80 dark:bg-green-950/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-950/35 transition-colors border border-green-100 dark:border-green-900/40">
              <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">{copy.cards.guideTitle}</h3>
              <p className="text-sm text-green-700 dark:text-green-300">{copy.cards.guideDesc}</p>
            </Link>
            <Link href="#contact" className="p-6 bg-purple-50/80 dark:bg-purple-950/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/35 transition-colors border border-purple-100 dark:border-purple-900/40">
              <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">{copy.cards.contactTitle}</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">{copy.cards.contactDesc}</p>
            </Link>
          </div>

          <section id="faq" className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{copy.sectionTitles.faq}</h2>
            {copy.faqs.map((faq, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </section>

          <section id="guidelines" className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{copy.sectionTitles.guide}</h2>
            {copy.guides.map((item, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.content}</p>
              </div>
            ))}
          </section>

          <section id="contact" className="mb-12">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{copy.sectionTitles.contact}</h2>
            <p className="mb-4">{copy.contactIntro}</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                {copy.contactItems[0].replace("support@gekaixing.com", "")}
                <a href="mailto:support@gekaixing.com" className="text-blue-500 hover:underline">
                  support@gekaixing.com
                </a>
              </li>
              <li>{copy.contactItems[1]}</li>
              <li>{copy.contactItems[2]}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b">{copy.sectionTitles.links}</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/tos" className="text-blue-500 hover:underline">
                {copy.relatedLinks.tos}
              </Link>
              <Link href="/privacy" className="text-blue-500 hover:underline">
                {copy.relatedLinks.privacy}
              </Link>
              <Link href="/about" className="text-blue-500 hover:underline">
                {copy.relatedLinks.about}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
