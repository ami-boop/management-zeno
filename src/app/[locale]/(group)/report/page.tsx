import { getTranslations } from 'next-intl/server'
import { Info } from 'lucide-react'
import ManagementReportForm from '@/components/report/ManagementReportForm'

export default async function ManagementReportPage() {
	const grades = [
		{ key: 'alef', hebrew: 'א׳' },
		{ key: 'bet', hebrew: 'ב׳' },
		{ key: 'gimel', hebrew: 'ג׳' },
		{ key: 'dalet', hebrew: 'ד׳' },
		{ key: 'he', hebrew: 'ה׳' },
		{ key: 'vav', hebrew: 'ו׳' },
		{ key: 'zayin', hebrew: 'ז׳' },
		{ key: 'het', hebrew: 'ח׳' },
		{ key: 'tet', hebrew: 'ט׳' },
		{ key: 'yud', hebrew: 'י׳' },
		{ key: 'yud_alef', hebrew: 'יא׳' },
		{ key: 'yud_bet', hebrew: 'יב׳' },
	]

	const profiles = [
		{ key: 'physics_computers', label: 'פיזיקה-מחשבים' },
		{ key: 'chemistry_biology', label: 'כימיה-ביולוגיה' },
		{ key: 'theatron', label: 'תיאטרון' },
		{ key: 'art_design', label: 'יצוב אמנות' },
	]

	const timeOptions = ['12:00', '12:45', '13:30', '14:40', '15:30']

	const classNumbers = Array.from({ length: 11 }, (_, i) => i + 1)

	const t = await getTranslations('managementReport')
	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='flex justify-center py-12 px-4'>
				<div className='max-w-md w-full'>
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
						{/* Header */}
						<div className='text-center mb-8'>
							<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
								<Info className='w-8 h-8 text-blue-600' />
							</div>
							<h1 className='text-2xl font-bold text-gray-900 mb-2'>
								{t('title')}
							</h1>
							<p className='text-gray-600 text-sm'>{t('description')}</p>
						</div>
						<ManagementReportForm
							grades={grades}
							profiles={profiles}
							timeOptions={timeOptions}
							classNumbers={classNumbers}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
