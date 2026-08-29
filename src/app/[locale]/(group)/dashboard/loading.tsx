import { Skeleton } from '@/components/ui/skeleton'

// app/dashboard/loading.tsx
export default function Loading() {
	return (
		<div className='bg-gray-50'>
			<div className='max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Header (title, description, status) */}
				<div className='mb-6'>
					<div className='flex items-start justify-between gap-4'>
						<div>
							<Skeleton className='h-8 w-64 bg-gray-300 rounded' />
							<Skeleton className='h-5 w-96 bg-gray-300 rounded mt-2' />
						</div>
						<Skeleton className='h-6 w-40 bg-gray-300 rounded' />
					</div>
				</div>

				{/* Stats grid (3 items) */}
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
						<Skeleton className='h-4 w-32 bg-gray-300 rounded' />
						<Skeleton className='h-8 w-20 bg-gray-300 rounded mt-3' />
					</div>
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
						<Skeleton className='h-4 w-36 bg-gray-300 rounded' />
						<Skeleton className='h-8 w-24 bg-gray-300 rounded mt-3' />
					</div>
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
						<Skeleton className='h-4 w-28 bg-gray-300 rounded' />
						<Skeleton className='h-8 w-16 bg-gray-300 rounded mt-3' />
					</div>
				</div>

				{/* Filters + content card */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
					{/* Filters header */}
					<div className='px-6 py-4 border-b border-gray-200'>
						<div className='flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between'>
							{/* Status filters */}
							<div className='flex flex-wrap gap-2'>
								<Skeleton className='h-9 w-20 rounded-md bg-gray-200' />
								<Skeleton className='h-9 w-28 rounded-md bg-gray-200' />
								<Skeleton className='h-9 w-32 rounded-md bg-gray-200' />
								<Skeleton className='h-9 w-28 rounded-md bg-gray-200' />
							</div>
							{/* Route filter + search */}
							<div className='flex flex-1 lg:flex-none items-center gap-2'>
								<Skeleton className='h-9 w-40 rounded-md bg-gray-200' />
								<Skeleton className='h-9 w-56 rounded-md bg-gray-200' />
							</div>
						</div>
					</div>

					{/* Table (desktop) */}
					<div className='hidden lg:block'>
						<div className='px-6 py-4'>
							<div className='w-full border border-gray-200 rounded-lg overflow-hidden'>
								{/* Table header */}
								<div className='grid grid-cols-12 gap-4 bg-gray-50 px-4 py-3 border-b border-gray-200'>
									<Skeleton className='h-4 w-24 col-span-3 bg-gray-300 rounded' />
									<Skeleton className='h-4 w-24 col-span-2 bg-gray-300 rounded' />
									<Skeleton className='h-4 w-24 col-span-2 bg-gray-300 rounded' />
									<Skeleton className='h-4 w-24 col-span-2 bg-gray-300 rounded' />
									<Skeleton className='h-4 w-24 col-span-2 bg-gray-300 rounded' />
									<Skeleton className='h-4 w-16 col-span-1 bg-gray-300 rounded justify-self-end' />
								</div>
								{/* Table rows */}
								{Array.from({ length: 5 }).map((_, idx) => (
									<div
										key={idx}
										className='grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-100'
									>
										<div className='col-span-3 flex items-center gap-3'>
											<Skeleton className='h-5 w-5 rounded-full bg-gray-200' />
											<Skeleton className='h-5 w-40 bg-gray-300 rounded' />
										</div>
										<Skeleton className='h-5 w-16 col-span-2 bg-gray-200 rounded' />
										<Skeleton className='h-5 w-16 col-span-2 bg-gray-200 rounded' />
										<div className='col-span-2'>
											<Skeleton className='h-6 w-28 bg-gray-200 rounded-full' />
										</div>
										<div className='col-span-2'>
											<Skeleton className='h-5 w-24 bg-gray-200 rounded' />
										</div>
										<div className='col-span-1 flex justify-end'>
											<Skeleton className='h-9 w-24 bg-gray-200 rounded-md' />
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Mobile cards */}
					<div className='lg:hidden px-6 py-4'>
						<div className='space-y-4'>
							{Array.from({ length: 4 }).map((_, idx) => (
								<div
									key={idx}
									className='border border-gray-200 rounded-lg p-4'
								>
									<div className='flex items-start justify-between'>
										<div>
											<Skeleton className='h-5 w-40 bg-gray-300 rounded' />
											<Skeleton className='h-4 w-28 bg-gray-200 rounded mt-2' />
										</div>
										<Skeleton className='h-6 w-20 bg-gray-200 rounded-full' />
									</div>
									<div className='grid grid-cols-2 gap-3 mt-4'>
										<Skeleton className='h-4 w-24 bg-gray-200 rounded' />
										<Skeleton className='h-4 w-24 bg-gray-200 rounded' />
										<Skeleton className='h-4 w-20 bg-gray-200 rounded' />
										<Skeleton className='h-4 w-20 bg-gray-200 rounded' />
									</div>
									<div className='mt-4 flex justify-end'>
										<Skeleton className='h-9 w-28 bg-gray-200 rounded-md' />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
