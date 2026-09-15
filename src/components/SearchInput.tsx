'use client'

import { Search } from 'lucide-react'

interface SearchInputProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	ariaLabel?: string
	wrapperClassName?: string
	inputClassName?: string
}

const DEFAULT_INPUT_CLASS =
	'w-full rounded-xl border border-gray-300 bg-white py-2 pe-3 ps-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none'

/** Text field with a leading search icon. */
export default function SearchInput({
	value,
	onChange,
	placeholder,
	ariaLabel,
	wrapperClassName = 'relative mb-4',
	inputClassName = DEFAULT_INPUT_CLASS,
}: SearchInputProps) {
	return (
		<div className={wrapperClassName}>
			<Search className='pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
			<input
				type='text'
				aria-label={ariaLabel}
				className={inputClassName}
				placeholder={placeholder}
				value={value}
				onChange={event => onChange(event.target.value)}
			/>
		</div>
	)
}
