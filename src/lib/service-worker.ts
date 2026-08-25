const SW_PATH = '/service-worker.js'
const SW_SCOPE = '/'
const AUTH_STATE_MESSAGE = 'AUTH_STATE'

const isServiceWorkerSupported = () => typeof navigator !== 'undefined' && 'serviceWorker' in navigator

export async function registerServiceWorker(): Promise<void> {
	if (!isServiceWorkerSupported()) return
	try {
		await navigator.serviceWorker.register(SW_PATH, { scope: SW_SCOPE })
	} catch {
		return
	}
}

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

async function queryAuthState(reg: ServiceWorkerRegistration): Promise<boolean | null> {
	return new Promise<boolean | null>(resolve => {
		const channel = new MessageChannel()
		channel.port1.onmessage = event => {
			if (event.data?.type === AUTH_STATE_MESSAGE) resolve(!!event.data.signedIn)
		}
		reg.active?.postMessage({ type: AUTH_STATE_MESSAGE }, [channel.port2])
		setTimeout(() => resolve(null), 500)
	})
}

export async function waitForServiceWorkerSignOut(timeoutMs = 3000): Promise<boolean> {
	if (!(await ensureServiceWorkerReady())) return false

	const reg = await navigator.serviceWorker.ready
	const start = Date.now()

	while (Date.now() - start < timeoutMs) {
		const signedIn = await queryAuthState(reg)
		if (signedIn === false) return true
		await new Promise(resolve => setTimeout(resolve, 100))
	}

	return false
}
