import Navbar from '@/components/gekaixing/Navbar'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export default async function HelpCenter(): Promise<JSX.Element> {
  const t = await getTranslations('ImitationX.Help')
  const faqKeys: string[] = ['1', '2', '3', '4', '5']
  const guideKeys: string[] = ['1', '2', '3']

  return (
    <>
      <Navbar />
      <div className='container mx-auto p-4 md:p-8'>
        <div className='mx-auto max-w-4xl'>
          <h1 className='mb-2 text-3xl font-bold'>{t('heroTitle')}</h1>
          <p className='mb-8 text-muted-foreground'>{t('heroSubTitle')}</p>

          <div className='mb-12 grid grid-cols-1 gap-4 md:grid-cols-3'>
            <Link
              href='#faq'
              className='rounded-lg border border-blue-100 bg-blue-50/80 p-6 transition-colors hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-950/20 dark:hover:bg-blue-950/35'
            >
              <h3 className='mb-2 font-semibold text-blue-900 dark:text-blue-200'>{t('cards.faqTitle')}</h3>
              <p className='text-sm text-blue-700 dark:text-blue-300'>{t('cards.faqDesc')}</p>
            </Link>
            <Link
              href='#guidelines'
              className='rounded-lg border border-green-100 bg-green-50/80 p-6 transition-colors hover:bg-green-100 dark:border-green-900/40 dark:bg-green-950/20 dark:hover:bg-green-950/35'
            >
              <h3 className='mb-2 font-semibold text-green-900 dark:text-green-200'>{t('cards.guideTitle')}</h3>
              <p className='text-sm text-green-700 dark:text-green-300'>{t('cards.guideDesc')}</p>
            </Link>
            <Link
              href='#contact'
              className='rounded-lg border border-amber-100 bg-amber-50/80 p-6 transition-colors hover:bg-amber-100 dark:border-amber-900/40 dark:bg-amber-950/20 dark:hover:bg-amber-950/35'
            >
              <h3 className='mb-2 font-semibold text-amber-900 dark:text-amber-200'>{t('cards.contactTitle')}</h3>
              <p className='text-sm text-amber-700 dark:text-amber-300'>{t('cards.contactDesc')}</p>
            </Link>
          </div>

          <section id='faq' className='mb-12'>
            <h2 className='mb-6 border-b pb-2 text-2xl font-bold'>{t('sectionTitles.faq')}</h2>
            {faqKeys.map((key: string) => (
              <div key={key} className='mb-8'>
                <h3 className='mb-2 text-lg font-semibold'>{t(`faqs.${key}.question`)}</h3>
                <p className='text-muted-foreground'>{t(`faqs.${key}.answer`)}</p>
              </div>
            ))}
          </section>

          <section id='guidelines' className='mb-12'>
            <h2 className='mb-6 border-b pb-2 text-2xl font-bold'>{t('sectionTitles.guide')}</h2>
            {guideKeys.map((key: string) => (
              <div key={key} className='mb-8'>
                <h3 className='mb-2 text-lg font-semibold'>{t(`guides.${key}.title`)}</h3>
                <p className='text-muted-foreground'>{t(`guides.${key}.content`)}</p>
              </div>
            ))}
          </section>

          <section id='contact' className='mb-12'>
            <h2 className='mb-6 border-b pb-2 text-2xl font-bold'>{t('sectionTitles.contact')}</h2>
            <p className='mb-4'>{t('contactIntro')}</p>
            <ul className='list-inside list-disc space-y-2 text-muted-foreground'>
              <li>
                {t('contactItems.emailPrefix')}
                <a href='mailto:support@gekaixing.com' className='text-blue-500 hover:underline'>
                  support@gekaixing.com
                </a>
              </li>
              <li>{t('contactItems.hours')}</li>
              <li>{t('contactItems.reply')}</li>
            </ul>
          </section>

          <section className='mb-8'>
            <h2 className='mb-6 border-b pb-2 text-2xl font-bold'>{t('sectionTitles.links')}</h2>
            <div className='flex flex-wrap gap-4'>
              <Link href='/tos' className='text-blue-500 hover:underline'>
                {t('relatedLinks.tos')}
              </Link>
              <Link href='/privacy' className='text-blue-500 hover:underline'>
                {t('relatedLinks.privacy')}
              </Link>
              <Link href='/about' className='text-blue-500 hover:underline'>
                {t('relatedLinks.about')}
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
