import type { ReactNode } from 'react'

export const fieldInputClassName =
	'w-full rounded-xl border border-zeno-line bg-zeno-surface px-3 py-2 text-sm text-zeno-ink tabular-nums focus:outline-none focus:border-zeno-amber focus:ring-2 focus:ring-zeno-amber/40 disabled:bg-zeno-paper-soft disabled:text-zeno-muted disabled:border-zeno-line'

interface FormFieldProps {
	label: ReactNode
	required?: boolean
	children: ReactNode
}

/** Labeled form row used by the entity dialogs. */
export default function FormField({ label, required, children }: FormFieldProps) {
	return (
		<label className='grid gap-1'>
			<span className='text-xs font-medium text-zeno-ink-soft'>
				{label}
				{required ? ' *' : null}
			</span>
			{children}
		</label>
	)
}
