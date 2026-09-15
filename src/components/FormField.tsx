import type { ReactNode } from 'react'

export const fieldInputClassName =
	'w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'

interface FormFieldProps {
	label: ReactNode
	required?: boolean
	children: ReactNode
}

/** Labeled form row used by the entity dialogs. */
export default function FormField({ label, required, children }: FormFieldProps) {
	return (
		<label className='grid gap-1'>
			<span className='text-xs font-medium text-gray-500'>
				{label}
				{required ? ' *' : null}
			</span>
			{children}
		</label>
	)
}
