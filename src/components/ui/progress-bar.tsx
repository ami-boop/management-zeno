import { cn } from '@/lib/utils'

type ColorVariant = 'emerald' | 'amber' | 'blue' | 'gray'

interface ProgressBarProps {
  value: number
  max?: number
  color?: ColorVariant
  size?: 'sm' | 'md' | 'lg'
  showBorder?: boolean
  className?: string
}

const colorClasses: Record<ColorVariant, { bar: string; bg: string }> = {
  emerald: { bar: 'bg-emerald-500', bg: 'bg-emerald-200' },
  amber: { bar: 'bg-amber-500', bg: 'bg-amber-200' },
  blue: { bar: 'bg-blue-500', bg: 'bg-blue-200' },
  gray: { bar: 'bg-gray-400', bg: 'bg-gray-200' },
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-2.5',
}

export function ProgressBar({
  value,
  max = 100,
  color = 'blue',
  size = 'md',
  showBorder = false,
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  const colors = colorClasses[color]

  return (
    <div
      className={cn(
        'w-full rounded-full',
        showBorder ? 'bg-gray-300/80 border border-gray-300' : colors.bg,
        sizeClasses[size],
        className
      )}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-300',
          colors.bar
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

export default ProgressBar
