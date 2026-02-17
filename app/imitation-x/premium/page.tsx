"use client";

import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Plan {
    name: string;
    price: string;
    description: string;
    highlight?: boolean;
    priceId: string;
    features: {
        text: string;
        included: boolean;
    }[];
}

const plans: Plan[] = [
    {
        name: "基础版",
        price: "¥0",
        priceId: 'price_1SJptU2Ms5Y6lijdJ9KLIrMU',
        description: "免费使用平台基础功能",
        features: [
            { text: "发帖", included: true },
            { text: "点赞 / 评论", included: true },
            { text: "关注用户", included: true },
            { text: "无广告", included: false },
            { text: "优先展示", included: false },
            { text: "编辑帖子", included: false },
            { text: "蓝V认证", included: false },
        ],
    },
    {
        name: "Premium",
        price: "¥28 / 月",
        priceId: 'price_1T1r3C2Ms5Y6lijd2jBbsj4g',
        description: "更少广告 + 更强功能",
        highlight: true,
        features: [
            { text: "发帖", included: true },
            { text: "点赞 / 评论", included: true },
            { text: "关注用户", included: true },
            { text: "减少广告", included: true },
            { text: "编辑帖子", included: true },
            { text: "更长视频上传", included: true },
            { text: "蓝V认证", included: false },
        ],
    },
    {
        name: "Premium+",
        price: "¥88 / 月",
        priceId: 'price_1T1r432Ms5Y6lijdlNB8BcdO',
        description: "完全无广告 + 最高优先级",
        features: [
            { text: "发帖", included: true },
            { text: "点赞 / 评论", included: true },
            { text: "关注用户", included: true },
            { text: "完全无广告", included: true },
            { text: "优先展示", included: true },
            { text: "编辑帖子", included: true },
            { text: "蓝V认证", included: true },
        ],
    },
];

async function subscribe(priceId: string) {
  try {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ priceId })
    })

    const text = await res.text()

    if (!res.ok) {
      throw new Error(text)
    }

    const data = JSON.parse(text)

    window.location.href = data.url
  } catch (err) {
    console.error("Stripe checkout failed:", err)
  }
}



export default function PremiumPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* header */}
            <div className="max-w-5xl mx-auto px-4 pt-16 pb-10 text-center">
                <h1 className="text-4xl font-bold">升级 Premium</h1>
                <p className="text-gray-500 mt-4 text-lg">
                    更少广告、更强功能、优先展示你的内容
                </p>
            </div>

            {/* pricing */}
            <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6 pb-20">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={cn(
                            "rounded-2xl border p-6 flex flex-col",
                            plan.highlight
                                ? "border-black shadow-xl scale-105"
                                : "border-gray-200"
                        )}
                    >
                        {plan.highlight && (
                            <div className="mb-4 text-xs font-bold bg-black text-white px-3 py-1 rounded-full w-fit">
                                推荐
                            </div>
                        )}

                        <h2 className="text-xl font-bold">{plan.name}</h2>

                        <div className="mt-3 text-3xl font-bold">{plan.price}</div>

                        <p className="text-gray-500 mt-2">{plan.description}</p>

                        <Button
                            className={cn(
                                "mt-6 rounded-full",
                                plan.highlight
                                    ? "bg-black text-white hover:bg-black/90"
                                    : ""
                            )}
                            variant={plan.highlight ? "default" : "outline"}
                            onClick={()=>subscribe(plan.priceId)}
                        >
                            订阅
                        </Button>

                        <div className="mt-6 space-y-3">
                            {plan.features.map((feature) => (
                                <div
                                    key={feature.text}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    {feature.included ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <X className="w-4 h-4 text-gray-300" />
                                    )}
                                    <span
                                        className={
                                            feature.included ? "text-black" : "text-gray-400"
                                        }
                                    >
                                        {feature.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* extra features */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold">为什么选择 Premium？</h2>

                    <div className="grid md:grid-cols-3 gap-6 mt-10">
                        <Feature
                            title="更少广告"
                            desc="减少干扰，专注内容"
                        />
                        <Feature
                            title="优先展示"
                            desc="你的内容更容易被看到"
                        />
                        <Feature
                            title="更多创作工具"
                            desc="编辑帖子、长视频等"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Feature({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="p-6 bg-white rounded-xl border">
            <div className="text-lg font-bold">{title}</div>
            <p className="text-gray-500 mt-2">{desc}</p>
        </div>
    );
}
