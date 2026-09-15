import { Skeleton } from '@/components/ui/skeleton'

/** Generic detail-page skeleton: title, status card, two content blocks. */
export default function DetailLoading() {
	return (
		<div className='mx-auto max-w-6xl px-4 py-6'>
			<div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
				<div>
					<Skeleton className='h-9 w-64 rounded bg-zeno-line-strong' />
					<Skeleton className='mt-2 h-4 w-44 rounded bg-zeno-line' />
				</div>
				<Skeleton className='h-6 w-24 rounded-full bg-zeno-line' />
			</div>
			<div className='grid gap-4'>
				<div className='zeno-card p-4 sm:p-6'>
					<Skeleton className='h-5 w-40 rounded bg-zeno-line-strong' />
					<Skeleton className='mt-3 h-24 w-full rounded-xl bg-zeno-line' />
				</div>
				<div className='zeno-card p-4 sm:p-6'>
					<Skeleton className='h-5 w-32 rounded bg-zeno-line-strong' />
					<div className='mt-3 grid gap-2'>
						<Skeleton className='h-4 w-full rounded bg-zeno-line' />
						<Skeleton className='h-4 w-5/6 rounded bg-zeno-line' />
						<Skeleton className='h-4 w-2/3 rounded bg-zeno-line' />
					</div>
				</div>
			</div>
		</div>
	)
}
