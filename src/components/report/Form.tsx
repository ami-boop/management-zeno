'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Status from './Status'
import Success from './Success'
import Notice from './Notice'
import StudentPicker from './StudentPicker'
import { Loader2, Users, UserCheck } from 'lucide-react'
import setStudentReturnStatus, { type ReportResult } from '@/app/actions/setStudentsReturnStatus'

const needsProfile = (grade: string) =>
	['tet', 'yud', 'yud_alef', 'yud_bet'].includes(grade)

interface ManagementReportFormProps {
	grades: { key: string; hebrew: string }[]
	profiles: { key: string; label: string }[]
	timeOptions: string[]
	classNumbers: number[]
}

type Mode = 'parallel' | 'manual'

export default function Form({
	grades,
	profiles,
	timeOptions,
	classNumbers,
}: ManagementReportFormProps) {
	const t = useTranslations('managementReport')
	const [mode, setMode] = useState<Mode>('parallel')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitError, setSubmitError] = useState(false)
	const [result, setResult] = useState<ReportResult | null>(null)
	const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
	const [selectedClass, setSelectedClass] = useState<string | null>(null)
	const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
	const [selectedTime, setSelectedTime] = useState<string | null>(null)
	const [selectedParallel, setSelectedParallel] = useState('')
	const [manualUids, setManualUids] = useState<string[]>([])
	const [manualStopId, setManualStopId] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (mode === 'manual' && manualUids.length === 0) return
		setIsSubmitting(true)
		setSubmitError(false)

		const body =
			mode === 'manual'
				? { manualUids, manualStopId, time: selectedTime }
				: {
						parallel: selectedParallel || null,
						className: selectedParallel ? null : `${selectedGrade}_${selectedClass}`,
						megama: selectedProfile,
						time: selectedTime,
					}

		const res = await setStudentReturnStatus(body)
		setIsSubmitting(false)
		if (res.ok) {
			setResult(res)
		} else {
			setSubmitError(true)
		}
	}

	const handleReset = () => {
		setResult(null)
		setSubmitError(false)
		setSelectedGrade(null)
		setSelectedClass(null)
		setSelectedProfile(null)
		setSelectedTime(null)
		setSelectedParallel('')
		setManualUids([])
		setManualStopId(null)
	}

	const parallelReady = selectedParallel
		? !!selectedTime
		: !!(
				selectedGrade &&
				selectedClass &&
				(!needsProfile(selectedGrade) || selectedProfile) &&
				selectedTime
			)
	const manualReady = manualUids.length > 0 && !!selectedTime
	const canSubmit = !(isSubmitting || (mode === 'parallel' ? !parallelReady : !manualReady))

	if (result) {
		return (
			<Success
				onReset={handleReset}
				updatedCount={result.updatedCount}
				operation={result.operation}
			/>
		)
	}

	return (
		<>
			<Status />
			{/* Mode Selection */}
			<div className='grid grid-cols-2 gap-2 mb-6'>
				<button
					type='button'
					onClick={() => setMode('parallel')}
					data-testid='mode-parallel'
					className={`inline-flex items-center justify-center gap-1.5 p-2.5 text-sm font-medium rounded-md border transition-colors duration-200 ${
						mode === 'parallel'
							? 'bg-blue-50 text-blue-700 border-blue-200'
							: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
					}`}
				>
					<Users className='h-4 w-4' />
					{t('modeParallel')}
				</button>
				<button
					type='button'
					onClick={() => setMode('manual')}
					data-testid='mode-manual'
					className={`inline-flex items-center justify-center gap-1.5 p-2.5 text-sm font-medium rounded-md border transition-colors duration-200 ${
						mode === 'manual'
							? 'bg-blue-50 text-blue-700 border-blue-200'
							: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
					}`}
				>
					<UserCheck className='h-4 w-4' />
					{t('modeManual')}
				</button>
			</div>

			{mode === 'manual' ? (
				<div className='mb-6'>
					<StudentPicker
						selectedUids={manualUids}
						onChange={setManualUids}
						onStopChange={setManualStopId}
					/>
				</div>
			) : (
				<>
					{/* Parallel Selection */}
					<div className='relative mb-6'>
						<label
							htmlFor='parallel-select'
							className='block text-sm font-medium text-gray-700 mb-2'
						>
							{t('parallelLabel')}
						</label>
						<select
							value={selectedParallel}
							onChange={e => {
								setSelectedParallel(e.target.value)
								if (e.target.value) {
									setSelectedGrade(null)
									setSelectedClass(null)
									setSelectedProfile(null)
									setSelectedTime(null)
								}
							}}
							className='w-full px-3 py-2 border border-amber-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500'
						>
							<option value=''>{t('selectParallel')}</option>
							{grades.map(grade => (
								<option key={grade.key} value={grade.key} data-testid='parallel-option'>
									{t('parallelOption', { grade: grade.hebrew })}
								</option>
							))}
						</select>
					</div>
					{/* Individual Class Selection */}
					{!selectedParallel && (
						<>
							{/* Grade Selection */}
							<div className='mb-6'>
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
												setSelectedClass(null)
												setSelectedProfile(null)
												setSelectedTime(null)
											}}
											className={`p-3 text-lg font-medium rounded-md border transition-colors duration-200 ${selectedGrade === grade.key
												? 'bg-blue-50 text-blue-700 border-blue-200'
												: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
												}`}
											data-testid='select-parallel'
										>
											{grade.hebrew}
										</button>
									))}
								</div>
							</div>
							{/* Class Number Selection */}
							{selectedGrade && (
								<div className='mb-6'>
									<label className='block text-sm font-medium text-gray-700 mb-3'>
										{t('classLabel')}
									</label>
									<div className='grid grid-cols-6 gap-2'>
										{classNumbers.map(number => (
											<button
												key={number}
												type='button'
												onClick={() => setSelectedClass(number.toString())}
												className={`p-2 text-sm font-medium rounded-md border transition-colors duration-200 ${selectedClass === number.toString()
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
								<div className='mb-6'>
									<label className='block text-sm font-medium text-gray-700 mb-3'>
										{t('profileLabel')}
									</label>
									<div className='grid grid-cols-1 gap-2'>
										<button
											type='button'
											onClick={() => setSelectedProfile('all')}
											className={`p-3 text-sm font-medium rounded-md border transition-colors duration-200 text-right ${selectedProfile === 'all'
												? 'bg-blue-50 text-blue-700 border-blue-200'
												: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
												}`}
										>
											{t('selectAllProfiles')}
										</button>
										{profiles.map(profile => (
											<button
												key={profile.key}
												type='button'
												onClick={() => setSelectedProfile(profile.key)}
												className={`p-3 text-sm font-medium rounded-md border transition-colors duration-200 text-right ${selectedProfile === profile.key
													? 'bg-blue-50 text-blue-700 border-blue-200'
													: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
													}`}
												data-testid='select-profile'
											>
												{profile.label}
											</button>
										))}
									</div>
								</div>
							)}
						</>
					)}
				</>
			)}
			{/* Time Selection */}
			{((mode === 'manual' && manualUids.length > 0) ||
				(mode === 'parallel' && selectedParallel) ||
				(mode === 'parallel' &&
					!selectedParallel &&
					selectedClass &&
					(!selectedGrade || !needsProfile(selectedGrade) || selectedProfile))) && (
					<div className='mb-6'>
						<label className='block text-sm font-medium text-gray-700 mb-3'>
							{t('timeLabel')}
						</label>
						<div className='grid grid-cols-3 gap-2'>
							{timeOptions?.length > 0 ? (
								timeOptions.map(time => (
									<button
										key={time}
										type='button'
										onClick={() => setSelectedTime(time)}
										className={`p-3 text-sm font-medium rounded-md border transition-colors duration-200 text-center ${selectedTime === time
											? 'bg-blue-50 text-blue-700 border-blue-200'
											: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
											}`}
										data-testid='select-time'
									>
										{time}
									</button>
								))
							) : (
								<p className='col-span-3 text-sm text-gray-500 text-center py-2'>
									{t('noTimeOptions')}
								</p>
							)}
						</div>
					</div>
				)}
			{/* Manual preview */}
			{mode === 'manual' && manualUids.length > 0 && (
				<div className='mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800'>
					{t('submitPreview', { count: manualUids.length })}
				</div>
			)}
			{submitError && (
				<div className='mb-6 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800'>
					{t('submitError')}
				</div>
			)}
			{/* Submit Button */}
			<button
				onClick={handleSubmit}
				disabled={!canSubmit}
				className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${!canSubmit
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
			<Notice />
		</>
	)
}
