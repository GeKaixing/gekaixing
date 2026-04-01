import { Button } from "@/components/ui/button"
import CookieConsent from "@/components/gekaixing/CookieConsent"
import { Compass, Globe2, Heart, MessageSquare, Repeat2, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

type FeatureCard = {
  key: "realtime" | "global" | "trend"
  icon: typeof Zap
}

const featureCards: FeatureCard[] = [
  { key: "realtime", icon: Zap },
  { key: "global", icon: Globe2 },
  { key: "trend", icon: Compass },
]

export default async function Page(): Promise<React.JSX.Element> {
  const t = await getTranslations("NoirLanding")

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-[#03060b] dark:text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#05080d]/90">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 md:px-8">
          <Link href="/" className="inline-flex items-center">
            <Image src="/logo.svg" alt="Gekaixing logo" width={128} height={28} priority className="h-7 w-auto dark:hidden" />
            <Image src="/logo-white.svg" alt="Gekaixing logo" width={128} height={28} priority className="hidden h-7 w-auto dark:block" />
          </Link>

          <nav className="hidden items-center gap-6 text-xs text-zinc-600 dark:text-zinc-300 md:flex">
            <Link href="#" className="transition-colors hover:text-zinc-950 dark:hover:text-white">
              {t("nav.center")}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/account/login" className="text-xs text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white md:text-sm">
              {t("nav.login")}
            </Link>
            <Link href="/account/signup">
              <Button className="h-10 rounded-full bg-zinc-950 px-5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 md:text-sm">
                {t("nav.signup")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-zinc-200 dark:border-white/10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_60%_10%,rgba(24,24,27,0.1),transparent_45%)] dark:bg-[radial-gradient(circle_at_60%_10%,rgba(255,255,255,0.06),transparent_45%)]" />
          <div className="pointer-events-none absolute right-[-220px] top-[70px] h-[520px] w-[920px] rounded-full bg-[repeating-radial-gradient(circle_at_15%_20%,rgba(39,39,42,0.1)_0,rgba(39,39,42,0.1)_2px,transparent_8px,transparent_22px)] opacity-40 dark:bg-[repeating-radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_2px,transparent_8px,transparent_22px)]" />

          <div className="mx-auto flex min-h-[640px] w-full max-w-[1200px] flex-col justify-center px-5 py-20 md:px-8">
            <span className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-zinc-300 bg-zinc-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:border-white/15 dark:bg-white/5 dark:text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-700 dark:bg-zinc-300" />
              {t("hero.badge")}
            </span>

            <h1 className="max-w-[580px] text-5xl font-black leading-[0.95] tracking-[-0.03em] md:text-7xl">
              {t("hero.titleLine1")}
              <br />
              {t("hero.titleLine2")}
            </h1>

            <p className="mt-6 max-w-[560px] text-lg leading-8 text-zinc-600 dark:text-zinc-300">{t("hero.description")}</p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/gekaixing">
                <Button className="h-12 rounded-full bg-zinc-950 px-8 font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
                  {t("hero.primaryCta")}
                </Button>
              </Link>
              <Link href="/gekaixing/explore">
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-zinc-300 bg-white px-8 font-semibold text-zinc-900 hover:bg-zinc-100 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  {t("hero.secondaryCta")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-zinc-50 dark:border-white/10 dark:bg-[#080c12]">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-16 md:px-8">
            <div className="mb-10 grid gap-5 md:grid-cols-2">
              <h2 className="text-4xl font-black tracking-[-0.03em] md:text-5xl">
                {t("features.titlePrefix")} <span className="italic text-zinc-600 dark:text-zinc-300">{t("features.titleNow")}</span>
              </h2>
              <p className="max-w-[420px] justify-self-start text-sm leading-6 text-zinc-600 dark:text-zinc-300 md:justify-self-end">{t("features.description")}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {featureCards.map((card: FeatureCard) => (
                <article key={card.key} className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-[#10151f]">
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-md bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-100">
                    <card.icon size={16} />
                  </div>
                  <h3 className="mb-3 text-2xl font-semibold tracking-tight">{t(`features.cards.${card.key}.title`)}</h3>
                  <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">{t(`features.cards.${card.key}.description`)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-white dark:border-white/10 dark:bg-[#02050a]">
          <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-5 py-16 md:grid-cols-[240px_1fr] md:px-8">
            <h2 className="text-5xl font-black leading-[0.9] tracking-[-0.04em] md:sticky md:top-28 md:self-start">{t("happening.title")}</h2>

            <div className="space-y-10">
              <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-white/10 dark:bg-[#0a0f17]">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-300 to-zinc-700" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    <span className="mr-1 font-semibold text-zinc-950 dark:text-white">{t("happening.post1.author")}</span>
                    <span>{t("happening.post1.handleTime")}</span>
                  </p>
                </div>
                <p className="text-2xl leading-9">{t("happening.post1.content")}</p>
                <div className="mt-5 flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-2"><MessageSquare size={14} />24</span>
                  <span className="flex items-center gap-2"><Repeat2 size={14} />12</span>
                  <span className="flex items-center gap-2"><Heart size={14} />158</span>
                </div>
              </article>

              <article className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-white/10 dark:bg-[#0a0f17]">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-500 to-zinc-900" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    <span className="mr-1 font-semibold text-zinc-950 dark:text-white">{t("happening.post2.author")}</span>
                    <span>{t("happening.post2.handleTime")}</span>
                  </p>
                </div>
                <p className="text-3xl leading-tight">{t("happening.post2.content")}</p>
                <img src="/test.jpg" alt={t("happening.post2.imageAlt")} className="mt-5 h-[280px] w-full rounded-xl object-cover md:h-[360px]" />
                <div className="mt-5 flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-2"><MessageSquare size={14} />89</span>
                  <span className="flex items-center gap-2"><Repeat2 size={14} />442</span>
                  <span className="flex items-center gap-2"><Heart size={14} />2.1k</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 dark:bg-[#080d17]">
          <div className="mx-auto w-full max-w-[1200px] px-5 py-24 text-center md:px-8">
            <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] md:text-7xl">{t("cta.title")}</h2>
            <p className="mx-auto mt-8 max-w-[520px] text-lg leading-8 text-zinc-600 dark:text-zinc-300">{t("cta.description")}</p>
            <Link href="/account/signup">
              <Button className="mt-10 h-12 rounded-full bg-zinc-950 px-10 font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
                {t("cta.button")}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white dark:border-white/10 dark:bg-[#070b13]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-5 px-5 py-8 text-xs text-zinc-600 dark:text-zinc-400 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/about">{t("footer.about")}</Link>
            <Link href="/help-center">{t("footer.helpCenter")}</Link>
            <Link href="/tos">{t("footer.tos")}</Link>
            <Link href="/privacy">{t("footer.privacy")}</Link>
            <Link href="/cookies">{t("footer.cookies")}</Link>
            <Link href="/accessibility">{t("footer.accessibility")}</Link>
            <Link href="/ads-info">{t("footer.ads")}</Link>
          </div>
          <p className="text-zinc-500 dark:text-zinc-500">{t("footer.copyright")}</p>
        </div>
      </footer>

      <CookieConsent />
    </div>
  )
}
