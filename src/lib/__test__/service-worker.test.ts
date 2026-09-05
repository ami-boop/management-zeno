import { installServiceWorkerTokenBridge } from '../service-worker'

type MessageHandler = (event: { data: unknown }) => void

function setup(auth: unknown) {
	const listeners: Record<string, MessageHandler> = {}
	;(global.navigator as unknown as { serviceWorker: unknown }).serviceWorker = {
		addEventListener: jest.fn((type: string, handler: MessageHandler) => {
			listeners[type] = handler
		}),
	}
	installServiceWorkerTokenBridge(auth as never)
	return {
		dispatch: (data: unknown) => listeners.message?.({ data }),
	}
}

const makePort = () => ({ postMessage: jest.fn() })

const flushMicrotasks = () => new Promise(resolve => setTimeout(resolve, 0))

describe('service worker token bridge', () => {
	it('replies with the current user id token', async () => {
		const port = makePort()
		const { dispatch } = setup({ currentUser: { getIdToken: async () => 'token-abc-'.repeat(10) } })

		dispatch({ type: 'GET_ID_TOKEN', port })
		await flushMicrotasks()

		expect(port.postMessage).toHaveBeenCalledWith({ type: 'ID_TOKEN', idToken: 'token-abc-'.repeat(10) })
	})

	it('replies with null when no user is signed in', async () => {
		const port = makePort()
		const { dispatch } = setup({ currentUser: null })

		dispatch({ type: 'GET_ID_TOKEN', port })
		await flushMicrotasks()

		expect(port.postMessage).toHaveBeenCalledWith({ type: 'ID_TOKEN', idToken: null })
	})

	it('replies with null when getIdToken rejects', async () => {
		const port = makePort()
		const { dispatch } = setup({
			currentUser: {
				getIdToken: () => Promise.reject(new Error('refresh failed')),
			},
		})

		dispatch({ type: 'GET_ID_TOKEN', port })
		await flushMicrotasks()

		expect(port.postMessage).toHaveBeenCalledWith({ type: 'ID_TOKEN', idToken: null })
	})

	it('ignores other message types and messages without a port', async () => {
		const port = makePort()
		const { dispatch } = setup({ currentUser: { getIdToken: async () => 'x' } })

		expect(() => dispatch({ type: 'AUTH_STATE', port })).not.toThrow()
		expect(() => dispatch({ type: 'GET_ID_TOKEN' })).not.toThrow()
		await flushMicrotasks()

		expect(port.postMessage).not.toHaveBeenCalled()
	})

	describe('stale token force refresh', () => {
		const makeToken = (expiresInSeconds: number) => {
			const encode = (obj: unknown) => Buffer.from(JSON.stringify(obj)).toString('base64url')
			return `${encode({ alg: 'RS256' })}.${encode({ exp: expiresInSeconds })}.sig`
		}

		it('force-refreshes when the token is expired or expiring within the leeway window', async () => {
			const port = makePort()
			const now = Math.floor(Date.now() / 1000)
			const getIdToken = jest
				.fn()
				.mockResolvedValueOnce(makeToken(now + 30)) // first call: about to expire
				.mockResolvedValueOnce(makeToken(now + 3600)) // forced refresh
			const { dispatch } = setup({ currentUser: { getIdToken } })

			dispatch({ type: 'GET_ID_TOKEN', port })
			await flushMicrotasks()

			expect(getIdToken.mock.calls[0]).toEqual([])
			expect(getIdToken).toHaveBeenNthCalledWith(2, true)
			expect(port.postMessage).toHaveBeenCalledWith({ type: 'ID_TOKEN', idToken: makeToken(now + 3600) })
		})

		it('answers with the cached token when it is still fresh', async () => {
			const port = makePort()
			const now = Math.floor(Date.now() / 1000)
			const fresh = makeToken(now + 3600)
			const getIdToken = jest.fn().mockResolvedValue(fresh)
			const { dispatch } = setup({ currentUser: { getIdToken } })

			dispatch({ type: 'GET_ID_TOKEN', port })
			await flushMicrotasks()

			expect(getIdToken).toHaveBeenCalledTimes(1)
			expect(port.postMessage).toHaveBeenCalledWith({ type: 'ID_TOKEN', idToken: fresh })
		})

		it('force-refreshes a token whose exp claim is missing or malformed', async () => {
			const port = makePort()
			const now = Math.floor(Date.now() / 1000)
			const getIdToken = jest
				.fn()
				.mockResolvedValueOnce('not-a-jwt')
				.mockResolvedValueOnce(makeToken(now + 3600))
			const { dispatch } = setup({ currentUser: { getIdToken } })

			dispatch({ type: 'GET_ID_TOKEN', port })
			await flushMicrotasks()

			expect(getIdToken).toHaveBeenNthCalledWith(2, true)
		})
	})
})
