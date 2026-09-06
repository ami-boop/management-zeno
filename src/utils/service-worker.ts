/**
 * Service worker helpers shared between the bridge and login flow.
 */

export const SW_PATH = '/service-worker.js'
export const SW_SCOPE = '/'

export const isServiceWorkerSupported = (): boolean =>
	typeof navigator !== 'undefined' && 'serviceWorker' in navigator

/**
 * Poll until the SW reports signed-out state or timeout.
 * Returns true if sign-out confirmed, false on timeout/error.
 */
export async function waitForServiceWorkerSignOut(timeoutMs = 3000): Promise<boolean> {
	if (!(await ensureServiceWorkerReady())) return false

	const reg = await navigator.serviceWorker.ready
	const start = Date.now()

	while (Date.now() - start < timeoutMs) {
		const signedIn = await queryAuthState(reg)
		if (signedIn === false) return true
		await new Promise((resolve) => setTimeout(resolve, 100))
	}

	return false
}

/** Register (or re-register) the service worker. */
export async function registerServiceWorker(): Promise<void> {
	if (!isServiceWorkerSupported()) return
	try {
		await navigator.serviceWorker.register(SW_PATH, { scope: SW_SCOPE })
	} catch {
		return
	}
}

/** Ensure SW is registered and has an active controller. */
export async function ensureServiceWorkerReady(): Promise<boolean> {
	if (!isServiceWorkerSupported()) return false
	try {
		await navigator.serviceWorker.register(SW_PATH, { scope: SW_SCOPE })
		const reg = await navigator.serviceWorker.ready
		return !!reg.active
	} catch {
		return false
	}
}

/** Ask the active SW whether a user is currently signed in. */
async function queryAuthState(reg: ServiceWorkerRegistration): Promise<boolean | null> {
	return new Promise<boolean | null>((resolve) => {
		const channel = new MessageChannel()
		channel.port1.onmessage = (event) => {
			if (event.data?.type === 'AUTH_STATE') resolve(!!event.data.signedIn)
		}
		reg.active?.postMessage({ type: 'AUTH_STATE' }, [channel.port2])
		setTimeout(() => resolve(null), 500)
	})
}