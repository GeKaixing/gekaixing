'use client'

import { Check, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ReactElement } from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PlanConfig {
  id: 'basic' | 'premium' | 'premiumPlus'
  priceKey: 'plans.basic.price' | 'plans.premium.price' | 'plans.premiumPlus.price'
  envKey: string
  highlight?: boolean
  featureCount: number
}

const planConfigs: PlanConfig[] = [
  {
    id: 'basic',
    priceKey: 'plans.basic.price',
    envKey: 'NEXT_PUBLIC_STRIPE_PRICE_BASIC',
    featureCount: 7,
  },
  {
    id: 'premium',
    priceKey: 'plans.premium.price',
    envKey: 'NEXT_PUBLIC_STRIPE_PRICE_PREMIUM',
    highlight: true,
    featureCount: 7,
  },
  {
    id: 'premiumPlus',
    priceKey: 'plans.premiumPlus.price',
    envKey: 'NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_PLUS',
    featureCount: 7,
  },
]

const planPriceIds: Record<PlanConfig['id'], string> = {
  basic: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC ?? '',
  premium: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM ?? '',
  premiumPlus: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_PLUS ?? '',
}

export default function PremiumPage(): ReactElement {
  const t = useTranslations('ImitationX.Premium')
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [loadingPlan, setLoadingPlan] = useState<PlanConfig['id'] | null>(null)

  async function subscribe(plan: PlanConfig): Promise<void> {
    const priceId = planPriceIds[plan.id]
    if (!priceId) {
      setCheckoutError(`Missing ${plan.envKey} in environment variables`)
      return
    }

    try {
      setCheckoutError(null)
      setLoadingPlan(plan.id)

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      })

      const result = (await res.json()) as {
        success?: boolean
        error?: string
        data?: { url?: string | null }
      }

      if (!res.ok || !result.success || !result.data?.url) {
        throw new Error(result.error ?? 'Failed to create Stripe checkout session')
      }

      window.location.href = result.data.url
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Stripe checkout failed'
      setCheckoutError(message)
      console.error('Stripe checkout failed:', err)
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <div className='mx-auto max-w-5xl px-4 pb-10 pt-16 text-center'>
        <h1 className='text-4xl font-bold'>{t('title')}</h1>
        <p className='mt-4 text-lg text-muted-foreground'>{t('subtitle')}</p>
      </div>

      <div className='mx-auto grid max-w-6xl gap-6 px-4 pb-20 md:grid-cols-3'>
        {planConfigs.map((plan: PlanConfig) => (
          <div
            key={plan.id}
            className={cn(
              'flex flex-col rounded-2xl border bg-card p-6',
              plan.highlight ? 'scale-105 border-primary shadow-xl' : 'border-border'
            )}
          >
            {plan.highlight && (
              <div className='mb-4 w-fit rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground'>
                {t('recommended')}
              </div>
            )}

            <h2 className='text-xl font-bold'>{t(`plans.${plan.id}.name`)}</h2>
            <div className='mt-3 text-3xl font-bold'>{t(plan.priceKey)}</div>
            <p className='mt-2 text-muted-foreground'>{t(`plans.${plan.id}.description`)}</p>

            <Button
              className={cn(
                'mt-6 rounded-full',
                plan.highlight ? 'bg-primary text-primary-foreground hover:opacity-90' : ''
              )}
              variant={plan.highlight ? 'default' : 'outline'}
              onClick={() => void subscribe(plan)}
              disabled={loadingPlan === plan.id}
            >
              {loadingPlan === plan.id ? 'Loading...' : t('subscribe')}
            </Button>

            <div className='mt-6 space-y-3'>
              {Array.from({ length: plan.featureCount }).map((_, index: number) => {
                const featurePrefix = `plans.${plan.id}.features.${index}`
                const included = t(`${featurePrefix}.included`) === 'true'

                return (
                  <div key={`${plan.id}-${index}`} className='flex items-center gap-3 text-sm'>
                    {included ? (
                      <Check className='h-4 w-4 text-green-500' />
                    ) : (
                      <X className='h-4 w-4 text-muted-foreground/40' />
                    )}
                    <span className={included ? 'text-foreground' : 'text-muted-foreground'}>
                      {t(`${featurePrefix}.text`)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {checkoutError ? (
        <div className='mx-auto mb-8 max-w-4xl rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive'>
          {checkoutError}
        </div>
      ) : null}

      <div className='bg-muted/40 py-20'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <h2 className='text-2xl font-bold'>{t('whyTitle')}</h2>

          <div className='mt-10 grid gap-6 md:grid-cols-3'>
            <Feature title={t('whyCards.1.title')} desc={t('whyCards.1.desc')} />
            <Feature title={t('whyCards.2.title')} desc={t('whyCards.2.desc')} />
            <Feature title={t('whyCards.3.title')} desc={t('whyCards.3.desc')} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Feature({ title, desc }: { title: string; desc: string }): ReactElement {
  return (
    <div className='rounded-xl border border-border bg-card p-6'>
      <div className='text-lg font-bold'>{title}</div>
      <p className='mt-2 text-muted-foreground'>{desc}</p>
    </div>
  )
}
