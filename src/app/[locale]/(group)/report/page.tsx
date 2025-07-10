import { getTranslations } from 'next-intl/server'
import { Info } from 'lucide-react'
import ManagementReportForm from '@/components/managementReport/ManagementReportForm'

export default async function ManagementReportPage() {
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
						<ManagementReportForm />
					</div>
				</div>
			</div>
		</div>
	)
}
