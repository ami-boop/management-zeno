'use client'

import { useEffect } from 'react'
import { auth } from '@/lib/firebase'
import { installServiceWorkerTokenBridge, registerServiceWorker } from '@/lib/service-worker'

export default function ServiceWorkerRegistrar() {
	useEffect(() => {
		installServiceWorkerTokenBridge(auth)

		if (document.readyState === 'complete') {
			registerServiceWorker()
			return
		}

		window.addEventListener('load', registerServiceWorker, { once: true })
		return () => window.removeEventListener('load', registerServiceWorker)
	}, [])

	return null
}
