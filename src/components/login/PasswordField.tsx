'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Eye, EyeClosed } from 'lucide-react'

interface PasswordFieldProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PasswordField({ value, onChange }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const t = useTranslations('Login')

  return (
    <div>
      <label className='mb-2 block text-sm font-semibold text-zeno-ink-soft'>
        {t('passwordLabel')}
      </label>
      <div className='relative'>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={t('passwordPlaceholder')}
          className='w-full rounded-xl border border-zeno-line bg-zeno-surface px-3 py-2.5 pr-10 text-sm text-zeno-ink placeholder-zeno-muted focus:outline-none focus:ring-2 focus:ring-zeno-amber/40'
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className='absolute inset-y-0 right-0 flex items-center pr-3 text-zeno-muted hover:text-zeno-ink'
        >
          {showPassword ? (
            <Eye className='h-4 w-4' data-testid='eye-icon' />
          ) : (
            <EyeClosed className='h-4 w-4' data-testid='eye-closed-icon' />
          )}
        </button>
      </div>
    </div>
  )
}
