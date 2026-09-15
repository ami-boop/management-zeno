import { Skeleton } from '@/components/ui/skeleton'

/** Generic list-page skeleton: title, filter pills, stacked rows. */
export default function ListLoading({ rows = 5 }: { rows?: number }) {
	return (
		<div className='mx-auto max-w-6xl px-4 py-6'>
			<div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
				<div>
					<Skeleton className='h-9 w-56 rounded bg-zeno-line-strong' />
					<Skeleton className='mt-2 h-4 w-40 rounded bg-zeno-line' />
				</div>
				<div className='flex items-center gap-2'>
					<Skeleton className='h-9 w-28 rounded-full bg-zeno-line' />
					<Skeleton className='h-9 w-28 rounded-full bg-zeno-line' />
				</div>
			</div>
			<div className='grid gap-3'>
				{Array.from({ length: rows }).map((_, i) => (
					<div key={i} className='zeno-card p-4'>
						<div className='flex items-center justify-between gap-2'>
							<Skeleton className='h-5 w-48 rounded bg-zeno-line-strong' />
							<Skeleton className='h-6 w-20 rounded-full bg-zeno-line' />
						</div>
						<Skeleton className='mt-3 h-4 w-2/3 rounded bg-zeno-line' />
					</div>
				))}
			</div>
		</div>
	)
}
