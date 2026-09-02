declare module 'maplibre-gl' {
	export type LngLatLike = [number, number]

	export class LngLatBounds {
		constructor(sw: LngLatLike, ne: LngLatLike)
		extend(coord: LngLatLike): LngLatBounds
	}

	export class Marker {
		constructor(options?: { element?: HTMLElement; anchor?: string })
		setLngLat(lngLat: LngLatLike): Marker
		addTo(map: Map): Marker
		getElement(): HTMLElement
		remove(): void
	}

	export class NavigationControl {
		constructor(options?: { showCompass?: boolean })
	}

	export class Map {
		constructor(options: {
			container: HTMLElement
			style: string
			bounds?: LngLatBounds
			fitBoundsOptions?: { padding?: number }
			attributionControl?: { compact?: boolean } | false
		})
		on(event: 'load', handler: () => void): void
		addSource(id: string, source: Record<string, unknown>): void
		addLayer(layer: Record<string, unknown>): void
		addControl(control: unknown, position?: string): void
		remove(): void
		resize(): void
	}
}
