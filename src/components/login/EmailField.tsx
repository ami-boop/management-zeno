'use client'

import { useTranslations } from 'next-intl'

interface EmailFieldProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function EmailField({ value, onChange }: EmailFieldProps) {
  const t = useTranslations('Login')

  return (
    <div>
      <label className='mb-2 block text-sm font-semibold text-zeno-ink-soft'>
        {t('emailLabel')}
      </label>
      <input
        type='text'
        value={value}
        onChange={onChange}
        placeholder={t('emailPlaceholder')}
        className='w-full rounded-xl border border-zeno-line bg-zeno-surface px-3 py-2.5 text-sm text-zeno-ink placeholder-zeno-muted focus:outline-none focus:ring-2 focus:ring-zeno-amber/40'
      />
    </div>
  )
}
