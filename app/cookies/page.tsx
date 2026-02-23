import Navbar from '@/components/gekaixing/Navbar'
import { getTranslations } from 'next-intl/server'
import React from 'react'

export default async function CookiesPage() {
  const t = await getTranslations('Legal.Cookies')

  return (
    <>
      <Navbar />
      <div className='container mx-auto p-4 md:p-8'>
        <div className='prose max-w-none'>
          <h1 className='mb-6 text-3xl font-bold'>{t('title')}</h1>
          <p className='mb-8 text-sm text-gray-500'>
            {t('updatedDateLabel')} {t('updatedDate')}
          </p>

          <p className='mb-4'>{t('intro')}</p>
          <hr className='my-8' />

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.whatIsCookie.title')}</h2>
            <p className='mb-2'>{t('sections.whatIsCookie.body')}</p>
          </section>

          <hr className='my-8' />

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.howWeUse.title')}</h2>
            <p className='mb-2'>{t('sections.howWeUse.summary')}</p>
            <ul className='list-inside list-disc space-y-2'>
              <li>{t('sections.howWeUse.items.0')}</li>
              <li>{t('sections.howWeUse.items.1')}</li>
              <li>{t('sections.howWeUse.items.2')}</li>
              <li>{t('sections.howWeUse.items.3')}</li>
            </ul>
          </section>

          <hr className='my-8' />

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.thirdParty.title')}</h2>
            <p className='mb-2'>{t('sections.thirdParty.body')}</p>
          </section>

          <hr className='my-8' />

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.manage.title')}</h2>
            <p className='mb-2'>{t('sections.manage.body1')}</p>
            <p>{t('sections.manage.body2')}</p>
          </section>

          <hr className='my-8' />

          <section className='mb-8'>
            <h2 className='mb-4 text-xl font-semibold'>{t('sections.contact.title')}</h2>
            <p>
              {t('sections.contact.body')}
              <br />
              {t('sections.contact.emailLabel')}{' '}
              <a href='mailto:privacy@gekaixing.com' className='text-blue-500 hover:underline'>
                privacy@gekaixing.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
