'use client'

import { useTranslations } from 'next-intl'
import { Bus } from 'lucide-react'

export default function Header() {
  const t = useTranslations('Login')

  return (
    <div className='text-center mb-8'>
      <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zeno-sage-soft text-zeno-sage shadow-zeno-card'>
        <Bus className='h-8 w-8' data-testid='login-logo' />
      </div>
      <p className='zeno-kicker mb-1.5'>{t('kicker')}</p>
      <h1 className='text-2xl font-bold tracking-tight text-zeno-ink mb-2'>
        {t('title')}
      </h1>
      <p className='text-sm text-zeno-ink-soft'>{t('subtitle')}</p>
    </div>
  )
}
