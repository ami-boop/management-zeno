'use client'

import { useMemo, useState } from 'react'

export interface SearchFilterOptions<T> {
	searchFields: (keyof T)[]
	initialSearch?: string
}

export function useSearchFilter<T>(
	items: T[] | null | undefined,
	options: SearchFilterOptions<T>,
) {
	const { searchFields, initialSearch = '' } = options
	const [search, setSearch] = useState(initialSearch)

	const filtered = useMemo(() => {
		if (!items) return null
		const query = search.trim().toLowerCase()
		if (!query) return items
		return items.filter((item) =>
			searchFields.some((field) => {
				const value = item[field]
				return value != null && String(value).toLowerCase().includes(query)
			}),
		)
	}, [items, search, searchFields])

	return { filtered, search, setSearch }
}