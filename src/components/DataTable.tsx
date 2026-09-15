import type { ReactNode, ThHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/** Shared table primitives — same paddings/typography across entity tables. */

export function Th({
	className,
	end,
	children,
	...rest
}: ThHTMLAttributes<HTMLTableCellElement> & { end?: boolean }) {
	return (
		<th
			className={cn(
				'px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase',
				end ? 'text-end' : 'text-start',
				className
			)}
			{...rest}
		>
			{children}
		</th>
	)
}

export function Td({
	className,
	children,
}: {
	className?: string
	children: ReactNode
}) {
	return <td className={cn('px-6 py-4', className)}>{children}</td>
}
