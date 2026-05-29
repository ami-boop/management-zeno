'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  const t = useTranslations('Error')

  useEffect(() => {
    console.error(error)
  }, [error])

  const handleRetry = () => {
    reset()
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {t('title')}
        </h1>
        
        <p className="text-muted-foreground mb-8">
          {t('description')}
        </p>

        <button
          onClick={handleRetry}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4" />
          {t('tryAgain')}
        </button>

        {error.digest && (
          <p className="mt-6 text-xs text-muted-foreground/60">
            {t('errorId')}: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
