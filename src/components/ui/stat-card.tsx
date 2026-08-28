import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

type StatTone = 'amber' | 'sage' | 'ink'

interface StatCardProps {
  label: string
  value: number | string
  icon?: ReactNode
  tone?: StatTone
  className?: string
}

const toneClasses: Record<StatTone, { icon: string; value: string }> = {
  amber: { icon: 'bg-zeno-amber/20 text-zeno-amber-ink', value: 'text-zeno-ink' },
  sage: { icon: 'bg-zeno-sage-soft text-zeno-sage', value: 'text-zeno-ink' },
  ink: { icon: 'bg-zeno-ink/10 text-zeno-ink', value: 'text-zeno-ink' },
}

export function StatCard({ label, value, icon, tone = 'ink', className }: StatCardProps) {
  const toneClass = toneClasses[tone]
  return (
    <div
      className={cn(
        'zeno-card px-5 py-4 flex items-center gap-4',
        className
      )}
      data-testid="stat-container"
    >
      {icon && (
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            toneClass.icon
          )}
        >
          {icon}
        </div>
      )}
      <div className='min-w-0'>
        <p className='zeno-kicker truncate'>{label}</p>
        <p className={cn('mt-1 text-2xl font-bold tabular-nums', toneClass.value)}>
          {value}
        </p>
      </div>
    </div>
  )
}

export default StatCard
