'use client'

import { getStatusConfig } from '@/utils/status'
import { useTranslations } from 'next-intl'

export interface StatusBadgeProps {
	status: string
	customLabels?: Record<string, string>
	customStyles?: Record<string, string>
}

export function StatusBadge({ status, customLabels, customStyles }: StatusBadgeProps) {
	const t = useTranslations('Common')
	const config = getStatusConfig(status, t, customLabels, customStyles)
	return (
		<span className={config.className}>
			{config.label}
		</span>
	)
}