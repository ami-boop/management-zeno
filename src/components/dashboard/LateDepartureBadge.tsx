import { useTranslations } from 'next-intl'

const LateDepartureBadge = ({ minutes }: { minutes: number }) => {
  const t = useTranslations('Dashboard')
  return (
    <span
      data-testid="late-departure-badge"
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-800 border-red-200"
    >
      {t('lateDeparture', { minutes })}
    </span>
  )
}

export default LateDepartureBadge
