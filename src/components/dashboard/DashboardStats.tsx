import { FC } from 'react'
import { useTranslations } from 'next-intl'
import { Users, AlertTriangle, Bus } from 'lucide-react'

interface Stat {
	label: string
	value: number
	change?: string
}

interface DashboardStatsProps {
	stats: Stat[]
}

const iconMap: Record<string, React.ReactNode> = {
	studentsOnBus: (
		<Users className='w-4 h-4 bg-emerald-500 rounded-full p-0.5' />
	),
	studentsNotMarked: (
		<AlertTriangle className='w-4 h-4 bg-amber-500 rounded-full p-0.5' />
	),
	busesNeeded: <Bus className='w-4 h-4 bg-blue-500 rounded-full p-0.5' />,
}

const DashboardStats: FC<DashboardStatsProps> = ({ stats }) => {
	const t = useTranslations('Dashboard')
	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
			{stats.map(stat => (
				<div
					key={stat.label}
					className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200'
				>
					<div className='flex items-center justify-between mb-4'>
						<h3 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
							{t(`stats.${stat.label}`)}
						</h3>
						{iconMap[stat.label]}
					</div>
					<div className='flex items-baseline'>
						<p className='text-3xl font-bold text-gray-900'>{stat.value}</p>
					</div>
				</div>
			))}
		</div>
	)
}

export default DashboardStats
