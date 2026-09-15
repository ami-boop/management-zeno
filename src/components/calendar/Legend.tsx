'use client'

import { useTranslations } from 'next-intl'
import { TYPE_COLORS } from '@/components/calendar/type-colors'

const TYPES = ['holiday', 'exam_day', 'half_day', 'no_transport', 'special_schedule'] as const

export default function Legend({ active, onToggle }: { active?: Set<string>; onToggle?: (type: string) => void }) {
	const t = useTranslations('Calendar')
	return (
		<div className='flex flex-wrap items-center gap-2'>
			{TYPES.map(type => {
				const cfg = TYPE_COLORS[type]
				const isActive = !active || active.has(type)
				return (
					<button
						key={type}
						type='button'
						onClick={() => onToggle?.(type)}
						aria-pressed={isActive}
						className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zeno-amber ${isActive ? 'opacity-100' : 'opacity-40 grayscale'} ${cfg.badge}`}
						title={t(`types.${type}`)}
					>
						<span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
						{t(`types.${type}`)}
					</button>
				)
			})}
		</div>
	)
}
