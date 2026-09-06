import { decodeJwtExpMs } from '@/utils/jwt'
import {
	waitForServiceWorkerSignOut,
	ensureServiceWorkerReady,
	registerServiceWorker,
	isServiceWorkerSupported,
} from '@/utils/service-worker'

const GET_ID_TOKEN_MESSAGE = 'GET_ID_TOKEN'
const ID_TOKEN_MESSAGE = 'ID_TOKEN'

// Must mirror the service worker: a token expiring within this window is
// treated as stale and force-refreshed, so an expired token is never attached.
const TOKEN_STALE_LEEWAY_MS = 120000

type FirebaseAuthLike = { currentUser: { getIdToken: (forceRefresh?: boolean) => Promise<string> } | null }

async function resolveToken(auth: FirebaseAuthLike): Promise<string | null> {
	const user = auth.currentUser
	if (!user) return null
	const token = await user.getIdToken()
	const expMs = decodeJwtExpMs(token)
	if (expMs === null || Date.now() >= expMs - TOKEN_STALE_LEEWAY_MS) {
		// The SDK can return its cached accessToken even when expired — force a
		// real refresh so the service worker never receives a stale token.
		return user.getIdToken(true)
	}
	return token
}

export function installServiceWorkerTokenBridge(firebaseAuth: FirebaseAuthLike): void {
	if (!isServiceWorkerSupported()) return

	navigator.serviceWorker.addEventListener('message', (event) => {
		const data = event.data as { type?: string; port?: MessagePort } | null
		if (data?.type !== GET_ID_TOKEN_MESSAGE || !data.port) return

		Promise.resolve(resolveToken(firebaseAuth))
			.catch(() => null)
			.then((idToken) => data.port?.postMessage({ type: ID_TOKEN_MESSAGE, idToken }))
	})
}

export { waitForServiceWorkerSignOut, ensureServiceWorkerReady, registerServiceWorker }