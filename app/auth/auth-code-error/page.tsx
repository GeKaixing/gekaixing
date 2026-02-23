import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTranslations } from 'next-intl/server'

export default async function page() {
  const t = await getTranslations('AuthCodeError')

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-6 p-4">
      <>
        <Image src={'/logo.svg'} width={120} height={120} alt='logo.svg' className='mb-4 dark:hidden' />
        <Image src={'/logo-white.svg'} width={120} height={120} alt='logo-white.svg' className='mb-4 hidden dark:block' />
      </>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-destructive">{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            {t('helpText')}
          </p>
          
          <div className="flex gap-4 justify-center mt-4">
            <Link 
              href="/account" 
              replace
              className="h-10 px-6 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md flex items-center justify-center transition-colors"
            >
              {t('backToAccount')}
            </Link>
            <Link 
              href="/signup" 
              className="h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md flex items-center justify-center transition-colors"
            >
              {t('signUpAgain')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
