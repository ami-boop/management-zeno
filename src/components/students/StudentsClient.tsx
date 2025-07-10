'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type { Student } from '@/app/[locale]/management/students/page'
import StudentTable from './StudentTable'
import StudentMobileCards from './StudentMobileCards'

interface StudentsClientProps {
	initialStudents: Student[]
}

export default function StudentsClient({
	initialStudents,
}: StudentsClientProps) {
	const t = useTranslations('Students')
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedFilter, setSelectedFilter] = useState('all')
	const [selectedStudents, setSelectedStudents] = useState<number[]>([])

	const students = initialStudents

	const filteredStudents = useMemo(() => {
		const query = searchQuery.toLowerCase()
		return students.filter(student => {
			const matchesFilter =
				selectedFilter === 'all' || student.status === selectedFilter
			const matchesSearch =
				query === '' ||
				student.name.toLowerCase().includes(query) ||
				student.grade.toLowerCase().includes(query) ||
				student.route.toLowerCase().includes(query) ||
				student.bus.toLowerCase().includes(query) ||
				student.guardian.toLowerCase().includes(query)
			return matchesFilter && matchesSearch
		})
	}, [students, selectedFilter, searchQuery])

	const stats = [
		{
			label: 'totalStudents',
			value: students.length,
			change: '+2 this week',
		},
		{
			label: 'activeToday',
			value: students.filter(s => s.status !== 'absent').length,
			change: `${Math.round(
				(students.filter(s => s.status !== 'absent').length / students.length) *
					100
			)}% attendance`,
		},
		{
			label: 'pendingPickup',
			value: students.filter(s => s.status === 'boarding').length,
			change: 'Next pickup: 8:05',
		},
	]

	const filterButtons = [
		{ key: 'all', label: t('filterAll'), count: students.length },
		{
			key: 'onboard',
			label: t('filterOnboard'),
			count: students.filter(s => s.status === 'onboard').length,
		},
		{
			key: 'boarding',
			label: t('filterBoarding'),
			count: students.filter(s => s.status === 'boarding').length,
		},
		{
			key: 'absent',
			label: t('filterAbsent'),
			count: students.filter(s => s.status === 'absent').length,
		},
		{
			key: 'dropped',
			label: t('filterDropped'),
			count: students.filter(s => s.status === 'dropped').length,
		},
	]

	const getStatusColor = (status: Student['status']) => {
		switch (status) {
			case 'onboard':
				return 'bg-green-50 text-green-800 border-green-200'
			case 'boarding':
				return 'bg-blue-50 text-blue-800 border-blue-200'
			case 'absent':
				return 'bg-red-50 text-red-800 border-red-200'
			case 'dropped':
				return 'bg-gray-50 text-gray-800 border-gray-200'
			default:
				return 'bg-gray-50 text-gray-800 border-gray-200'
		}
	}

	const getStatusDot = (status: Student['status']) => {
		switch (status) {
			case 'onboard':
				return 'bg-green-500'
			case 'boarding':
				return 'bg-blue-500'
			case 'absent':
				return 'bg-red-500'
			case 'dropped':
				return 'bg-gray-500'
			default:
				return 'bg-gray-500'
		}
	}

	const handleSelectStudent = (studentId: number) => {
		setSelectedStudents(prev =>
			prev.includes(studentId)
				? prev.filter(id => id !== studentId)
				: [...prev, studentId]
		)
	}

	const handleSelectAll = () => {
		if (selectedStudents.length === filteredStudents.length) {
			setSelectedStudents([])
		} else {
			setSelectedStudents(filteredStudents.map(s => s.id))
		}
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Header */}
				<div className='mb-8'>
					<div className='flex items-center justify-between mb-6'>
						<div>
							<h1 className='text-3xl font-bold text-gray-900 mb-2'>
								{t('management')}
							</h1>
							<p className='text-gray-600'>{t('description')}</p>
						</div>
						<div className='flex items-center space-x-3'>
							<button className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200'>
								{/* export icon */}
								{t('exportData')}
							</button>
							<button className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200'>
								{/* add icon */}
								{t('addStudent')}
							</button>
						</div>
					</div>

					{/* Stats */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
						{stats.map(stat => (
							<div
								key={stat.label}
								className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'
							>
								<div className='flex items-center justify-between mb-2'>
									<h3 className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
										{t(stat.label)}
									</h3>
								</div>
								<div className='flex items-baseline'>
									<p className='text-3xl font-bold text-gray-900'>
										{stat.value}
									</p>
								</div>
								<p className='text-sm text-gray-500 mt-1'>{stat.change}</p>
							</div>
						))}
					</div>
				</div>

				{/* Main Content */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4'>
							<h2 className='text-xl font-semibold text-gray-900'>
								{t('management')}
							</h2>
							{/* Search */}
							<div className='relative max-w-md'>
								<input
									type='text'
									placeholder={t('searchPlaceholder')}
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
									className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
								/>
							</div>
						</div>

						{/* Filters */}
						<div className='flex flex-wrap gap-2 mb-4'>
							{filterButtons.map(filter => (
								<button
									key={filter.key}
									onClick={() => setSelectedFilter(filter.key)}
									className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
										selectedFilter === filter.key
											? 'bg-blue-100 text-blue-800 border border-blue-200'
											: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
									}`}
								>
									{filter.label}
									<span
										className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
											selectedFilter === filter.key
												? 'bg-blue-200 text-blue-800'
												: 'bg-gray-100 text-gray-600'
										}`}
									>
										{filter.count}
									</span>
								</button>
							))}
						</div>

						{/* Bulk Actions */}
						{selectedStudents.length > 0 && (
							<div className='flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-3 mb-4'>
								<span className='text-sm text-blue-800'>
									{selectedStudents.length} {t('selected')}
								</span>
								<div className='flex space-x-2'>
									<button className='text-sm text-blue-700 hover:text-blue-900'>
										{t('edit')}
									</button>
									<button className='text-sm text-red-700 hover:text-red-900'>
										{t('delete')}
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Desktop Table */}
					<div className='hidden lg:block overflow-hidden'>
						<StudentTable
							students={filteredStudents}
							selectedStudents={selectedStudents}
							onSelectStudent={handleSelectStudent}
							onSelectAll={handleSelectAll}
							t={t}
						/>
					</div>

					{/* Mobile Cards */}
					<StudentMobileCards
						students={filteredStudents}
						selectedStudents={selectedStudents}
						onSelectStudent={handleSelectStudent}
						t={t}
					/>

					{filteredStudents.length === 0 && (
						<div className='text-center py-12'>
							<h3 className='mt-2 text-sm font-medium text-gray-900'>
								{t('noResults')}
							</h3>
							<p className='mt-1 text-sm text-gray-500'>
								{searchQuery ? t('tryAdjustingSearch') : t('noStudents')}
							</p>
							{!searchQuery && (
								<div className='mt-6'>
									<button className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'>
										{t('addStudent')}
									</button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
