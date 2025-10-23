'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import ClassSelector from './ClassSelector'
import DayNavigation from './DayNavigation'
import ScheduleGrid from './ScheduleGrid'
import { Book, Info } from 'lucide-react'
import { getLessonsSchedule } from '@/app/actions/getLessons'

interface ScheduleViewerClientProps {
	grades: { key: string; label: string; hebrew: string }[]
	days: { key: string; label: string; hebrew: string }[]
	times: Record<number, string>
}

const ScheduleViewerClient = ({
	grades,
	days,
	times,
}: ScheduleViewerClientProps) => {
	const t = useTranslations('managementLessons')
	const [selectedGrade, setSelectedGrade] = useState('')
	const [selectedClass, setSelectedClass] = useState('')
	const [selectedDay, setSelectedDay] = useState('sunday')
	const [showSchedule, setShowSchedule] = useState(false)
	const [_selectedSchedule, setSelectedSchedule] = useState('')
	const [scheduleData, setScheduleData] = useState<any>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleViewSchedule = async () => {
		if (selectedGrade && selectedClass) {
			const scheduleKey = `${selectedGrade}_${selectedClass}`
			setSelectedSchedule(scheduleKey)
			setLoading(true)
			setError(null)
			setScheduleData(null)
			try {
				const res = await getLessonsSchedule(scheduleKey)
				if (!res.ok) throw new Error('Not found')
				setScheduleData(res)
				setShowSchedule(true)
			} catch (_e) {
				setError(t('notFound'))
			} finally {
				setLoading(false)
			}
		}
	}

	const handleBackToSelection = () => {
		setShowSchedule(false)
		setSelectedSchedule('')
		setSelectedDay('sunday')
		setScheduleData(null)
		setError(null)
	}

	const getLessonTime = (lessonNumber: number): string => {
		return times[lessonNumber] || ''
	}

	if (showSchedule && scheduleData) {
		const currentLessons = scheduleData.schedule[selectedDay] || []
		return (
			<div className='min-h-screen bg-gray-50'>
				<div className='max-w-4xl mx-auto py-8 px-4'>
					{/* Header */}
					<div className='flex items-center justify-between mb-8'>
						<div>
							<h1 className='text-3xl font-bold text-gray-900 mb-2'>
								{t('scheduleFor') + ' ' + scheduleData.className}
							</h1>
							<p className='text-gray-600'>
								{t('lessonsForDay') + ' ' + t(`days.${selectedDay}`)}
							</p>
						</div>
						<button
							onClick={handleBackToSelection}
							className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200'
						>
							← {t('backToSelection')}
						</button>
					</div>
					{/* Day Navigation */}
					<DayNavigation
						days={days}
						selectedDay={selectedDay}
						setSelectedDay={setSelectedDay}
						t={t}
					/>
					{/* Schedule Grid */}
					<ScheduleGrid
						currentLessons={currentLessons}
						getLessonTime={getLessonTime}
						t={t}
					/>
				</div>
			</div>
		)
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='flex justify-center py-12 px-4'>
				<div className='max-w-md w-full'>
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
						{/* Header */}
						<div className='text-center mb-8'>
							<div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
								{/* иконка */}
								<Book className='w-8 h-8 text-blue-600' />
							</div>
							<h1 className='text-2xl font-bold text-gray-900 mb-2'>
								{t('viewClassSchedule')}
							</h1>
							<p className='text-gray-600 text-sm'>{t('selectClassToView')}</p>
						</div>
						{/* Form */}
						<div className='space-y-6 mb-2'>
							<ClassSelector
								grades={grades}
								selectedGrade={selectedGrade}
								setSelectedGrade={setSelectedGrade}
								selectedClass={selectedClass}
								setSelectedClass={setSelectedClass}
								t={t}
							/>
							{/* View Schedule Button */}
							<div className='mt-4 mb-2'>
								<button
									onClick={handleViewSchedule}
									disabled={!selectedGrade || !selectedClass || loading}
									className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
										!selectedGrade || !selectedClass || loading
											? 'bg-gray-400 text-white cursor-not-allowed'
											: 'bg-blue-600 text-white hover:bg-blue-700'
									}`}
								>
									{loading ? t('loading') : t('viewSchedule')}
								</button>
							</div>
							{error && (
								<div className='text-red-600 text-sm mt-2'>{error}</div>
							)}
						</div>
						{/* Info Notice */}
						<div className='mt-8 p-3 bg-blue-50 border border-blue-200 rounded-md'>
							<div className='flex'>
								<Info className='w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5' />
								<p className='text-sm text-blue-800'>{t('infoNotice')}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ScheduleViewerClient
