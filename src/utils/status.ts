import { useTranslations } from 'next-intl'

export interface StatusConfig {
	label: string
	className: string
	icon?: React.ReactNode
}

const STATUS_STYLES: Record<string, string> = {
	pending: 'bg-amber-50 text-amber-700 border-amber-200',
	approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
	manager_approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
	rejected: 'bg-red-50 text-red-700 border-red-200',
	manager_rejected: 'bg-red-50 text-red-700 border-red-200',
	active: 'bg-green-100 text-green-700',
	inactive: 'bg-gray-100 text-gray-500',
}

export function getStatusConfig(
	status: string,
	t: ReturnType<typeof useTranslations>,
	customLabels?: Record<string, string>,
	customStyles?: Record<string, string>,
): StatusConfig {
	const style = customStyles?.[status] ?? STATUS_STYLES[status] ?? STATUS_STYLES.pending
	const label = customLabels?.[status] ?? t(`status.${status}`)
	return {
		label,
		className: `inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${style}`,
	}
}