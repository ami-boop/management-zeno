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
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {t('passwordLabel')}
      </label>
      <div className='relative'>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={t('passwordPlaceholder')}
          className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 pr-10'
        />
        <button
          type='button'
          onClick={() => setShowPassword(!showPassword)}
          className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600'
        >
          {showPassword ? (
            <Eye className='w-4 h-4' data-testid='eye-icon' />
          ) : (
            <EyeClosed className='w-4 h-4' data-testid='eye-closed-icon' />
          )}
        </button>
      </div>
    </div>
  )
}
