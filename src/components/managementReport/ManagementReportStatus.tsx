import { useTranslations } from 'next-intl'

export default function ManagementReportStatus() {
	const t = useTranslations('managementReport')
	const currentTime = new Date().toLocaleTimeString('en-US', {
		hour12: false,
		hour: '2-digit',
		minute: '2-digit',
	})
	const busArrivalTime = new Date(Date.now() + 18 * 60000).toLocaleTimeString(
		'en-US',
		{
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
		}
	)
	return (
		<div className='bg-gray-50 rounded-lg p-4 mb-6 space-y-3'>
			<div className='flex justify-between items-center'>
				<span className='text-sm text-gray-600'>{t('currentTime')}</span>
				<span className='text-sm font-medium text-gray-900'>{currentTime}</span>
			</div>
			<div className='flex justify-between items-center'>
				<span className='text-sm text-gray-600'>{t('busArrival')}</span>
				<span className='text-sm font-medium text-blue-600'>
					{busArrivalTime}
				</span>
			</div>
			<div className='flex justify-between items-center'>
				<span className='text-sm text-gray-600'>{t('reportingAs')}</span>
				<span className='text-sm font-medium text-gray-900'>Administrator</span>
			</div>
		</div>
	)
}
