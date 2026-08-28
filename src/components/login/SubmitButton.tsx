'use client'

import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface SubmitButtonProps {
  isSubmitting: boolean
  isDisabled: boolean
}

export default function SubmitButton({ isSubmitting, isDisabled }: SubmitButtonProps) {
  const t = useTranslations('Login')

  return (
    <button
      type='submit'
      disabled={isDisabled}
      className={cn(
        'w-full rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200',
        isDisabled
          ? 'cursor-not-allowed bg-zeno-line/40 text-zeno-muted'
          : 'zeno-primary'
      )}
    >
      {isSubmitting ? (
        <span className='flex items-center justify-center'>
          <Loader2 className='-ml-1 mr-3 h-4 w-4 animate-spin' />
          {t('signingIn')}
        </span>
      ) : (
        t('signInButton')
      )}
    </button>
  )
}
