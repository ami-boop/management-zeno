const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty'
const MAPLIBRE_VERSION = '6.6.0'
const MAPLIBRE_CSS_URL = `https://cdn.jsdelivr.net/npm/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css`
const MAPLIBRE_JS_URL = `https://cdn.jsdelivr.net/npm/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.mjs`

export type MapLibreNamespace = typeof import('maplibre-gl')

let maplibrePromise: Promise<MapLibreNamespace> | null = null

export function loadMaplibre(): Promise<MapLibreNamespace> {
	if (!maplibrePromise) {
		maplibrePromise = import(
			/* webpackIgnore: true */
			/* turbopackIgnore: true */
			MAPLIBRE_JS_URL
		) as Promise<MapLibreNamespace>
		maplibrePromise.catch(() => {
			maplibrePromise = null
		})
		if (!document.querySelector(`link[data-maplibre="true"]`)) {
			const link = document.createElement('link')
			link.rel = 'stylesheet'
			link.href = MAPLIBRE_CSS_URL
			link.dataset.maplibre = 'true'
			document.head.appendChild(link)
		}
	}
	return maplibrePromise
}

export { STYLE_URL }
