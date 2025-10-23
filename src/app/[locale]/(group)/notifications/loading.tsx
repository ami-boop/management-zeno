import Header from '@/components/Header'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
	return (
		<div className='min-h-screen bg-gray-50'>
			<Header />
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Page header: title, description, unread pill */}
				<div className='mb-8'>
					<div className='flex items-center justify-between'>
						<div>
							<Skeleton className='h-8 w-56 bg-gray-300 rounded' />
							<Skeleton className='h-5 w-80 bg-gray-300 rounded mt-2' />
						</div>
						<div className='flex items-center space-x-2'>
							<Skeleton className='h-6 w-28 bg-red-100 rounded-full' />
						</div>
					</div>
				</div>

				{/* Controls: filters and actions */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-6'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
							{/* Filters */}
							<div className='flex flex-wrap gap-2'>
								<Skeleton className='h-8 w-24 rounded-md bg-gray-200' />
								<Skeleton className='h-8 w-28 rounded-md bg-gray-200' />
								<Skeleton className='h-8 w-28 rounded-md bg-gray-200' />
								<Skeleton className='h-8 w-24 rounded-md bg-gray-200' />
							</div>

							{/* Actions */}
							<div className='flex items-center space-x-2'>
								<Skeleton className='h-6 w-28 bg-gray-200 rounded' />
								<Skeleton className='h-6 w-24 bg-gray-200 rounded' />
							</div>
						</div>
					</div>
				</div>

				{/* Notifications list skeleton */}
				<div className='space-y-2'>
					{Array.from({ length: 5 }).map((_, idx) => (
						<div key={idx} className='border rounded-lg shadow-sm bg-white'>
							<div className='p-4'>
								<div className='flex items-start justify-between gap-4'>
									<div className='flex items-start space-x-3 flex-1'>
										<Skeleton className='h-6 w-6 rounded-full bg-gray-200 mt-0.5' />
										<div className='flex-1 min-w-0'>
											<div className='flex items-center justify-between mb-2'>
												<div className='flex items-center space-x-2'>
													<Skeleton className='h-5 w-20 bg-gray-200 rounded-full' />
													<Skeleton className='h-2 w-2 rounded-full bg-blue-300' />
												</div>
												<div className='flex items-center text-xs text-gray-500 space-x-1'>
													<Skeleton className='h-4 w-4 rounded bg-gray-200' />
													<Skeleton className='h-3 w-24 rounded bg-gray-200' />
												</div>
											</div>
											<Skeleton className='h-4 w-72 bg-gray-300 rounded' />
										</div>
									</div>
									<div className='flex items-center space-x-1'>
										<Skeleton className='h-6 w-6 rounded bg-gray-200' />
										<Skeleton className='h-6 w-6 rounded bg-gray-200' />
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
