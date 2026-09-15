interface MapFallbackProps {
	message: string
	height?: string
}

/** Gray placeholder for failed or coordinate-less maps. */
export default function MapFallback({ message, height = 'h-[420px]' }: MapFallbackProps) {
	return (
		<div className={`flex ${height} w-full items-center justify-center rounded-xl bg-gray-50`}>
			<p className='text-sm font-medium text-gray-500'>{message}</p>
		</div>
	)
}
