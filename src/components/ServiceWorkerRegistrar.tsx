'use client'

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/service-worker'

export default function ServiceWorkerRegistrar() {
	useEffect(() => {
		if (document.readyState === 'complete') {
			registerServiceWorker()
			return
		}

		window.addEventListener('load', registerServiceWorker, { once: true })
		return () => window.removeEventListener('load', registerServiceWorker)
	}, [])

	return null
}
