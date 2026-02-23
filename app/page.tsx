import CookieConsent from "@/components/gekaixing/CookieConsent"
import Navbar from "@/components/gekaixing/Navbar"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, MessageCircle, Shield, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { getTranslations } from "next-intl/server"

type FeatureItem = {
  title: string
  description: string
  icon: typeof Sparkles
}

type StepItem = {
  step: string
  title: string
  description: string
}

export default async function Page() {
  const t = await getTranslations("Landing")
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const featureItems: FeatureItem[] = [
    {
      title: t("features.social.title"),
      description: t("features.social.description"),
      icon: MessageCircle,
    },
    {
      title: t("features.ai.title"),
      description: t("features.ai.description"),
      icon: Bot,
    },
    {
      title: t("features.security.title"),
      description: t("features.security.description"),
      icon: Shield,
    },
  ]

  const stepItems: StepItem[] = [
    {
      step: "01",
      title: t("steps.first.title"),
      description: t("steps.first.description"),
    },
    {
      step: "02",
      title: t("steps.second.title"),
      description: t("steps.second.description"),
    },
    {
      step: "03",
      title: t("steps.third.title"),
      description: t("steps.third.description"),
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f4f0] text-zinc-900">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,123,0,0.26),transparent_58%)]" />
      <div className="pointer-events-none absolute right-[-120px] top-[340px] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,rgba(0,117,255,0.2),transparent_62%)]" />

      <Navbar user={user} />
      <CookieConsent />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-20 pt-8 md:px-10">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700">
              <Zap size={14} />
              {t("hero.badge")}
            </span>

            <div className="space-y-4">
              <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                {t("hero.titleLine1")}
                <span className="block text-[#0047ab]">{t("hero.titleLine2")}</span>
              </h1>
              <p className="max-w-xl text-base leading-7 text-zinc-700 sm:text-lg">
                {t("hero.description")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/imitation-x">
                <Button className="h-11 rounded-full px-6 text-sm font-semibold">
                  {t("hero.primaryCta")}
                  <ArrowRight />
                </Button>
              </Link>
              <Link href="/blog">
                <Button
                  variant="outline"
                  className="h-11 rounded-full border-zinc-400 bg-transparent px-6 text-sm font-semibold"
                >
                  {t("hero.secondaryCta")}
                </Button>
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label={t("stats.arch.label")} value={t("stats.arch.value")} />
              <StatCard label={t("stats.db.label")} value={t("stats.db.value")} />
              <StatCard label={t("stats.auth.label")} value={t("stats.auth.value")} />
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-300 bg-white/90 p-4 shadow-[0_20px_80px_-48px_rgba(0,0,0,0.45)]">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-950 p-5 text-zinc-100">
              <div className="mb-5 flex items-center justify-between text-xs text-zinc-400">
                <span className="tracking-[0.16em]">GKX PREVIEW</span>
                <span>{t("preview.liveModules")}</span>
              </div>

              <div className="space-y-3">
                <PreviewRow title={t("preview.feed.title")} detail={t("preview.feed.detail")} tone="bg-cyan-400/20" />
                <PreviewRow title={t("preview.chat.title")} detail={t("preview.chat.detail")} tone="bg-orange-400/20" />
                <PreviewRow title={t("preview.ai.title")} detail={t("preview.ai.detail")} tone="bg-blue-400/20" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">{t("featureSection.badge")}</p>
            <h2 className="text-3xl font-black sm:text-4xl">{t("featureSection.title")}</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featureItems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-zinc-300 bg-white p-5 transition-transform duration-200 hover:-translate-y-1"
              >
                <item.icon className="mb-4 text-zinc-800" />
                <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                <p className="text-sm leading-6 text-zinc-700">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-300 bg-[linear-gradient(135deg,#ffffff,#eceef7)] p-6 sm:p-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">{t("workflow.badge")}</p>
              <h2 className="text-3xl font-black sm:text-4xl">{t("workflow.title")}</h2>
            </div>
            <span className="rounded-full bg-zinc-900 px-4 py-1 text-xs font-semibold text-white">
              {t("workflow.tag")}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {stepItems.map((item) => (
              <article key={item.step} className="rounded-2xl border border-zinc-300 bg-white p-5">
                <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-zinc-500">{item.step}</p>
                <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                <p className="text-sm leading-6 text-zinc-700">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-zinc-900 bg-zinc-950 p-8 text-zinc-100 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">{t("cta.badge")}</p>
              <h2 className="text-3xl font-black sm:text-4xl">{t("cta.title")}</h2>
              <p className="max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">
                {t("cta.description")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/imitation-x">
                <Button className="h-11 rounded-full bg-white px-6 font-semibold text-zinc-900 hover:bg-zinc-200">
                  {t("cta.primary")}
                </Button>
              </Link>
              <Link href="/account">
                <Button
                  variant="outline"
                  className="h-11 rounded-full border-zinc-500 bg-transparent px-6 font-semibold text-white hover:bg-zinc-800"
                >
                  {t("cta.secondary")}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-300 bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-800">{value}</p>
    </div>
  )
}

function PreviewRow({
  title,
  detail,
  tone,
}: {
  title: string
  detail: string
  tone: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5">
      <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-zinc-100">{title}</p>
        <p className="truncate text-xs text-zinc-400">{detail}</p>
      </div>
    </div>
  )
}
