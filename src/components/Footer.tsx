export default function Footer() {
	return (
		<footer className='bg-white border-t border-gray-200 mt-auto'>
			<div className='max-w-7xl mx-auto px-6 lg:px-10 py-6'>
				<div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
					<div className='flex items-center space-x-4'>
						<p className='text-gray-600 text-sm'>
							© 2025 Zeno Fleet Management. All rights reserved.
						</p>
					</div>
					<div className='flex items-center space-x-6 text-sm'>
						<a
							href='#'
							className='text-gray-500 hover:text-gray-700 transition-colors duration-200'
						>
							Privacy Policy
						</a>
						<a
							href='#'
							className='text-gray-500 hover:text-gray-700 transition-colors duration-200'
						>
							Terms of Service
						</a>
						<a
							href='#'
							className='text-gray-500 hover:text-gray-700 transition-colors duration-200'
						>
							Support
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}
