'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Check, Search } from 'lucide-react'
import getManagementStudents from '@/app/actions/getManagementStudents'
import type { ManagementStudent } from '@/lib/api-contracts'

interface StudentPickerProps {
	selectedUids: string[]
	onChange: (uids: string[]) => void
	onStopChange: (stopId: string | null) => void
}

const listClass = (active: boolean) =>
	`flex items-center justify-between w-full px-3 py-2.5 rounded-md border text-start transition-colors duration-200 ${
		active
			? 'bg-blue-50 text-blue-700 border-blue-200'
			: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
	}`

const PAGE_SIZE = 200

export default function StudentPicker({ selectedUids, onChange, onStopChange }: StudentPickerProps) {
	const t = useTranslations('managementReport')
	const [search, setSearch] = useState('')
	const [stopId, setStopId] = useState('')
	const [students, setStudents] = useState<ManagementStudent[]>([])
	const [loading, setLoading] = useState(false)
	const [loadingMore, setLoadingMore] = useState(false)
	const [hasMore, setHasMore] = useState(false)
	const [error, setError] = useState(false)
	// Bumped by every search reload: in-flight loadMore responses from a stale
	// search must not append into the fresh list.
	const epochRef = useRef(0)

	useEffect(() => {
		let cancelled = false
		const timer = setTimeout(async () => {
			++epochRef.current
			setLoading(true)
			setError(false)
			setHasMore(false)
			const result = await getManagementStudents({ search, limit: PAGE_SIZE, offset: 0 })
			if (cancelled) return
			if (result.error) {
				setError(true)
				setStudents([])
			} else {
				setStudents(result.students)
				setHasMore(result.students.length === PAGE_SIZE)
			}
			setLoading(false)
		}, 250)
		return () => {
			cancelled = true
			clearTimeout(timer)
		}
	}, [search])

	const loadMore = async () => {
		const epoch = epochRef.current
		setLoadingMore(true)
		const result = await getManagementStudents({
			search,
			limit: PAGE_SIZE,
			offset: students.length,
		})
		if (epoch !== epochRef.current) return
		if (result.error) {
			setError(true)
		} else {
			setStudents(prev => [...prev, ...result.students])
			setHasMore(result.students.length === PAGE_SIZE)
		}
		setLoadingMore(false)
	}

	const toggle = (uid: string) => {
		onChange(
			selectedUids.includes(uid)
				? selectedUids.filter(id => id !== uid)
				: [...selectedUids, uid]
		)
	}

	const toggleAllVisible = () => {
		const visibleUids = students.map(s => s.uid)
		const allSelected = visibleUids.every(uid => selectedUids.includes(uid))
		onChange(allSelected ? [] : [...new Set([...selectedUids, ...visibleUids])])
	}

	const stopOptions = [
		...new Set(
			students
				.filter(s => selectedUids.includes(s.uid))
				.map(s => s.stopId)
				.filter((id): id is string => Boolean(id))
		),
	]

	// Reset the stop override when it no longer belongs to any selected student.
	const stopOptionsKey = stopOptions.join('|')
	const selectedStopValid = !stopId || stopOptions.includes(stopId)
	useEffect(() => {
		if (!selectedStopValid) {
			setStopId('')
			onStopChange(null)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stopOptionsKey, selectedStopValid])

	const visibleAllSelected =
		students.length > 0 && students.every(student => selectedUids.includes(student.uid))

	return (
		<div className='space-y-3'>
			<div className='flex items-center justify-between'>
				<span className='text-sm font-medium text-gray-700'>
					{t('selectedPreview', { count: selectedUids.length })}
				</span>
				{students.length > 0 && (
					<button
						type='button'
						onClick={toggleAllVisible}
						className='text-sm font-medium text-blue-600 hover:text-blue-700'
					>
						{visibleAllSelected ? t('clearSelection') : t('selectAllVisible')}
					</button>
				)}
			</div>

			<div className='relative'>
				<Search className='absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
				<input
					type='text'
					placeholder={t('searchStudentsPlaceholder')}
					value={search}
					onChange={e => setSearch(e.target.value)}
					className='block w-full ps-9 pe-3 py-2 border border-gray-300 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
				/>
			</div>

			{error && <p className='text-sm text-red-600'>{t('studentsLoadError')}</p>}
			{!error && loading && students.length === 0 && (
				<p className='text-sm text-gray-500 text-center py-2'>{t('loadingStudents')}</p>
			)}
			{!error && !loading && students.length === 0 && (
				<p className='text-sm text-gray-500 text-center py-2'>{t('noStudentsFound')}</p>
			)}

			<div className='max-h-64 overflow-y-auto space-y-2 rounded-md border border-gray-200 p-2'>
				{students.map(student => {
					const active = selectedUids.includes(student.uid)
					return (
						<button
							key={student.uid}
							type='button'
							onClick={() => toggle(student.uid)}
							className={listClass(active)}
						>
						<span className='text-sm'>
							{student.firstName} {student.lastName}
							{student.grade && <span className='text-gray-500'> · {student.grade}</span>}
						</span>
					{active && <Check className='h-4 w-4 text-blue-600' />}
					</button>
					)
				})}
				{hasMore && (
					<button
						type='button'
						onClick={() => void loadMore()}
						disabled={loadingMore}
						className='w-full px-3 py-2 rounded-md border border-gray-300 text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 disabled:opacity-50'
					>
						{loadingMore ? t('loadingStudents') : t('loadMore')}
					</button>
				)}
			</div>

			{selectedUids.length > 0 && stopOptions.length > 1 && (
				<div>
					<label htmlFor='stop-override' className='block text-sm font-medium text-gray-700 mb-2'>
						{t('stopOverrideLabel')}
					</label>
					<select
						id='stop-override'
						value={stopId}
						onChange={e => {
							const value = e.target.value
							setStopId(value)
							onStopChange(value || null)
						}}
						className='w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
					>
						<option value=''>{t('stopOverrideDefault')}</option>
						{stopOptions.map(option => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>
			)}
		</div>
	)
}
