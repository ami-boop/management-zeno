'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Map as MapLibreMap } from 'maplibre-gl'
import { loadMaplibre } from '@/lib/maplibre-loader'

interface StopMapProps {
	name: string
	lat: number | null
	lng: number | null
}

export default function StopMap({ name, lat, lng }: StopMapProps) {
	const t = useTranslations('Stops')
	const containerRef = useRef<HTMLDivElement | null>(null)
	const mapRef = useRef<MapLibreMap | null>(null)
	const [failed, setFailed] = useState(false)
	const empty = lat === null || lng === null

	useEffect(() => {
		if (lat === null || lng === null) return
		let cancelled = false
		const container = containerRef.current
		if (!container) return

		loadMaplibre()
			.then(maplibregl => {
				if (cancelled || !containerRef.current || containerRef.current !== container) return
				const map = new maplibregl.Map({
					container,
					style: 'https://tiles.openfreemap.org/styles/liberty',
					center: [lng, lat],
					zoom: 15,
					attributionControl: { compact: true },
				})
				mapRef.current = map
				map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')

				map.on('load', () => {
					if (mapRef.current !== map) return

					const wrapper = document.createElement('div')
					wrapper.style.display = 'flex'
					wrapper.style.flexDirection = 'column'
					wrapper.style.alignItems = 'center'
					wrapper.style.gap = '4px'
					wrapper.style.pointerEvents = 'auto'
					wrapper.style.cursor = 'default'

					const label = document.createElement('div')
					label.textContent = name
					label.style.padding = '3px 9px'
					label.style.borderRadius = '999px'
					label.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'
					label.style.border = '1.5px solid #dfe5e8'
					label.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.18)'
					label.style.whiteSpace = 'nowrap'
					label.style.fontFamily = 'inherit'
					label.style.fontSize = '11px'
					label.style.fontWeight = '700'
					label.style.color = '#40515c'
					label.style.lineHeight = '1.2'

					const dot = document.createElement('div')
					dot.style.width = '12px'
					dot.style.height = '12px'
					dot.style.borderRadius = '50%'
					dot.style.backgroundColor = '#ffffff'
					dot.style.border = '3px solid #2563eb'
					dot.style.boxShadow = '0 1px 4px rgba(21, 35, 45, 0.25)'

					wrapper.appendChild(label)
					wrapper.appendChild(dot)

					new maplibregl.Marker({ element: wrapper, anchor: 'bottom' })
						.setLngLat([lng, lat])
						.addTo(map)
				})
			})
			.catch(() => {
				if (!cancelled) setFailed(true)
			})

		return () => {
			cancelled = true
			mapRef.current?.remove()
			mapRef.current = null
		}
	}, [lat, lng, name])

	if (failed) {
		return (
			<div className='flex h-[320px] w-full items-center justify-center rounded-xl bg-gray-50'>
				<p className='text-sm font-medium text-gray-500'>{t('mapFailed')}</p>
			</div>
		)
	}

	if (empty) {
		return (
			<div className='flex h-[320px] w-full items-center justify-center rounded-xl bg-gray-50'>
				<p className='text-sm font-medium text-gray-500'>{t('noCoordinates')}</p>
			</div>
		)
	}

	return (
		<div
			ref={containerRef}
			dir='ltr'
			className='h-[320px] w-full rounded-xl border border-gray-200'
		/>
	)
}
