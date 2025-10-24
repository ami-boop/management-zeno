'use client'

import { useTranslations } from 'next-intl'

interface UsernameFieldProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function EmailField({ value, onChange }: UsernameFieldProps) {
  const t = useTranslations('Login')

  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {t('emailLabel')}
      </label>
      <input
        type='text'
        value={value}
        onChange={onChange}
        placeholder={t('emailPlaceholder')}
        className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500'
      />
    </div>
  )
}
