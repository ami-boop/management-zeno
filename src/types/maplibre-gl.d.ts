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
			center?: [number, number]
			zoom?: number
			bounds?: LngLatBounds
			fitBoundsOptions?: { padding?: number }
			attributionControl?: { compact?: boolean } | false
		})
		on(event: 'load', handler: () => void): void
		addSource(id: string, source: Record<string, unknown>): void
		getSource(id: string): unknown
		removeSource(id: string): void
		addLayer(layer: Record<string, unknown>): void
		getLayer(id: string): unknown
		removeLayer(id: string): void
		addControl(control: unknown, position?: string): void
		remove(): void
		resize(): void
		easeTo(options: { center?: [number, number]; zoom?: number; duration?: number }): void
		fitBounds(
			bounds: [LngLatLike, LngLatLike],
			options?: { padding?: number; maxZoom?: number; duration?: number }
		): void
	}
}
