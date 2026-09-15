/** Pulsing "on route" badge for the buses list (table + cards). */
export default function OnRouteBadge({ label }: { label: string }) {
	return (
		<span className='inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700'>
			<span className='relative flex h-1.5 w-1.5'>
				<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75' />
				<span className='relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500' />
			</span>
			{label}
		</span>
	)
}
