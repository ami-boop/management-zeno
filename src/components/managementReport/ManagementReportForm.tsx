'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import ManagementReportStatus from './ManagementReportStatus'
import ManagementReportSuccess from './ManagementReportSuccess'
import ManagementReportNotice from './ManagementReportNotice'
import { Loader2 } from 'lucide-react'

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

const needsProfile = (grade: string) =>
	['tet', 'yud', 'yud_alef', 'yud_bet'].includes(grade)

function generateClassNumbers() {
	return Array.from({ length: 11 }, (_, i) => i + 1)
}

export default function ManagementReportForm() {
	const t = useTranslations('managementReport')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [selectedGrade, setSelectedGrade] = useState('')
	const [selectedClass, setSelectedClass] = useState('')
	const [selectedProfile, setSelectedProfile] = useState('')
	const [selectedParallel, setSelectedParallel] = useState('')

	const handleSubmit = async () => {
		setIsSubmitting(true)
		await new Promise(resolve => setTimeout(resolve, 1500))
		setIsSubmitting(false)
		setIsSubmitted(true)
	}

	const handleReset = () => {
		setIsSubmitted(false)
		setSelectedGrade('')
		setSelectedClass('')
		setSelectedProfile('')
		setSelectedParallel('')
	}

	if (isSubmitted) {
		return <ManagementReportSuccess onReset={handleReset} />
	}

	return (
		<>
			<ManagementReportStatus />
			{/* Parallel Selection */}
			<div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
				<label className='block text-sm font-medium text-amber-800 mb-3'>
					{t('parallelLabel')}
				</label>
				<select
					value={selectedParallel}
					onChange={e => {
						setSelectedParallel(e.target.value)
						if (e.target.value) {
							setSelectedGrade('')
							setSelectedClass('')
							setSelectedProfile('')
						}
					}}
					className='w-full px-3 py-2 border border-amber-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500'
				>
					<option value=''>{t('selectParallel')}</option>
					{grades.map(grade => (
						<option key={grade.key} value={grade.key}>
							{t('parallelOption', { grade: grade.hebrew })}
						</option>
					))}
				</select>
			</div>
			{/* Individual Class Selection */}
			{!selectedParallel && (
				<>
					{/* Grade Selection */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-3'>
							{t('gradeLabel')}
						</label>
						<div className='grid grid-cols-4 gap-2'>
							{grades.map(grade => (
								<button
									key={grade.key}
									type='button'
									onClick={() => {
										setSelectedGrade(grade.key)
										setSelectedClass('')
										setSelectedProfile('')
									}}
									className={`p-3 text-lg font-medium rounded-md border transition-colors duration-200 ${
										selectedGrade === grade.key
											? 'bg-blue-50 text-blue-700 border-blue-200'
											: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
									}`}
								>
									{grade.hebrew}
								</button>
							))}
						</div>
					</div>
					{/* Class Number Selection */}
					{selectedGrade && (
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-3'>
								{t('classLabel')}
							</label>
							<div className='grid grid-cols-6 gap-2'>
								{generateClassNumbers().map(number => (
									<button
										key={number}
										type='button'
										onClick={() => setSelectedClass(number.toString())}
										className={`p-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
											selectedClass === number.toString()
												? 'bg-blue-50 text-blue-700 border-blue-200'
												: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
										}`}
									>
										{grades.find(g => g.key === selectedGrade)?.hebrew}
										{number}
									</button>
								))}
							</div>
						</div>
					)}
					{/* Profile Selection */}
					{selectedGrade && selectedClass && needsProfile(selectedGrade) && (
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-3'>
								{t('profileLabel')}
							</label>
							<div className='grid grid-cols-1 gap-2'>
								{profiles.map(profile => (
									<button
										key={profile.key}
										type='button'
										onClick={() => setSelectedProfile(profile.key)}
										className={`p-3 text-sm font-medium rounded-md border transition-colors duration-200 text-right ${
											selectedProfile === profile.key
												? 'bg-blue-50 text-blue-700 border-blue-200'
												: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
										}`}
									>
										{profile.label}
									</button>
								))}
							</div>
						</div>
					)}
				</>
			)}
			{/* Submit Button */}
			<button
				onClick={handleSubmit}
				disabled={
					isSubmitting ||
					(!selectedParallel &&
						(!selectedGrade ||
							!selectedClass ||
							(needsProfile(selectedGrade) && !selectedProfile)))
				}
				className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
					isSubmitting ||
					(!selectedParallel &&
						(!selectedGrade ||
							!selectedClass ||
							(needsProfile(selectedGrade) && !selectedProfile)))
						? 'bg-gray-400 text-white cursor-not-allowed'
						: 'bg-blue-600 text-white hover:bg-blue-700'
				}`}
			>
				{isSubmitting ? (
					<div className='flex items-center justify-center'>
						<Loader2 className='animate-spin -ml-1 mr-3 h-4 w-4 text-white' />
						{t('submitting')}
					</div>
				) : (
					t('reportButton')
				)}
			</button>
			<ManagementReportNotice />
		</>
	)
}
