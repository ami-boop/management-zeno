'use client'

import { Users, TrendingUp, Car, Wrench } from 'lucide-react'
import type { FleetStats } from '@/types/fleet'

interface FleetStatsProps {
	stats: FleetStats
	t: (key: string) => string
}

export default function FleetStats({ stats, t }: FleetStatsProps) {
	return (
		<div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<div className='flex items-center'>
					<div className='flex-1'>
						<p className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
							{t('status.inService')}
						</p>
						<p className='text-2xl font-bold text-emerald-600'>
							{stats.inService}
						</p>
					</div>
					<div className='w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center'>
						<Car className='w-4 h-4 text-emerald-600' />
					</div>
				</div>
			</div>
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<div className='flex items-center'>
					<div className='flex-1'>
						<p className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
							{t('status.maintenance')}
						</p>
						<p className='text-2xl font-bold text-amber-600'>
							{stats.maintenance}
						</p>
					</div>
					<div className='w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center'>
						<Wrench className='w-4 h-4 text-amber-600' />
					</div>
				</div>
			</div>
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<div className='flex items-center'>
					<div className='flex-1'>
						<p className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
							{t('totalCapacity')}
						</p>
						<p className='text-2xl font-bold text-gray-900'>
							{stats.totalCapacity}
						</p>
					</div>
					<div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center'>
						<Users className='w-4 h-4 text-blue-600' />
					</div>
				</div>
			</div>
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<div className='flex items-center'>
					<div className='flex-1'>
						<p className='text-sm font-medium text-gray-500 uppercase tracking-wide'>
							{t('averageCapacity')}
						</p>
						<p className='text-2xl font-bold text-gray-900'>
							{stats.avgCapacity}
						</p>
					</div>
					<div className='w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center'>
						<TrendingUp className='w-4 h-4 text-gray-600' />
					</div>
				</div>
			</div>
		</div>
	)
}
