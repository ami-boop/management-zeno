/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth-compat.js')

firebase.initializeApp({
  apiKey: '__FIREBASE_API_KEY__',
  authDomain: '__FIREBASE_AUTH_DOMAIN__',
  projectId: '__FIREBASE_PROJECT_ID__',
})

const PASS_THROUGH_PATTERNS = [/_next\/static\//, /_next\/image\?/, /favicon\.ico$/, /service-worker\.js$/]

const GET_ID_TOKEN = 'GET_ID_TOKEN'
const ID_TOKEN = 'ID_TOKEN'

const isSecureOrigin = () => self.location.protocol === 'https:' || self.location.hostname === 'localhost'

// A token is considered stale this many milliseconds before its `exp` claim.
// Sending an expired token makes the API reject the request outright, so we
// treat near-expiry tokens as stale and force-refresh instead.
const TOKEN_STALE_LEEWAY_MS = 120000

// The Firebase SDK restores the persisted user and can hand back its cached
// accessToken even when the stored expirationTime has already passed (e.g.
// the device slept through the refresh window and the silent refresh failed).
// We therefore verify the `exp` claim ourselves before trusting any token.
function decodeJwtExpMs(idToken) {
  try {
    const payload = idToken.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const parsed = JSON.parse(json)
    return typeof parsed.exp === 'number' ? parsed.exp * 1000 : null
  } catch {
    return null
  }
}

function isTokenStale(idToken) {
  const expMs = decodeJwtExpMs(idToken)
  if (expMs === null) return true
  return Date.now() >= expMs - TOKEN_STALE_LEEWAY_MS
}
// The SW's compat auth instance may lag behind a sign-in that happened on a
// page (IDB sync), so wait for the user to appear instead of trusting a
// one-shot snapshot.
function waitForUser(timeoutMs = 5000) {
  const existing = firebase.auth().currentUser
  if (existing) return Promise.resolve(existing)
  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      unsubscribe()
      resolve(firebase.auth().currentUser)
    }, timeoutMs)
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        clearTimeout(timeout)
        unsubscribe()
        resolve(user)
      }
    })
  })
}

async function getFreshIdToken() {
  const user = await waitForUser()
  if (!user) return null
  try {
    const token = await user.getIdToken()
    if (!isTokenStale(token)) return token
    // Cached token is (about to be) expired — force a real refresh.
    return await user.getIdToken(true)
  } catch {
    return null
  }
}

function queryClientToken(client, timeoutMs = 1500) {
  return new Promise(resolve => {
    const channel = new MessageChannel()
    const timer = setTimeout(() => {
      channel.port1.onmessage = null
      resolve(null)
    }, timeoutMs)
    channel.port1.onmessage = event => {
      clearTimeout(timer)
      const idToken = event.data?.idToken
      resolve(typeof idToken === 'string' && idToken.length > 50 ? idToken : null)
    }
    client.postMessage({ type: GET_ID_TOKEN, port: channel.port2 }, [channel.port2])
  })
}

async function askClientsForToken() {
  try {
    const clientList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const ordered = [...clientList].sort((a, b) => Number(b.focused) - Number(a.focused))
    for (const client of ordered) {
      const token = await queryClientToken(client)
      if (token) return token
    }
  } catch {}
  return null
}

async function resolveIdToken() {
  const clientToken = await askClientsForToken()
  if (clientToken && !isTokenStale(clientToken)) return clientToken
  // Client answered with a stale/undecodable token — fall back to our own
  // auth instance, which force-refreshes in getFreshIdToken().
  const ownToken = await getFreshIdToken()
  if (ownToken) return ownToken
  // Nothing fresh available: send the request WITHOUT auth rather than with
  // a known-expired token (the app will show its signed-out flow).
  return null
}

async function getBodyContent(request) {
  if (request.method === 'GET' || request.method === 'HEAD') return undefined
  try {
    return await request.text()
  } catch {
    return undefined
  }
}

self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', event => {
  if (event.data?.type === 'AUTH_STATE' && event.source) {
    event.source.postMessage({ type: 'AUTH_STATE', signedIn: !!firebase.auth().currentUser })
  }
})

self.addEventListener('fetch', event => {
  const request = event.request
  const url = new URL(request.url)

  if (url.origin !== self.location.origin) return
  if (!isSecureOrigin()) return
  if (PASS_THROUGH_PATTERNS.some(pattern => pattern.test(url.pathname + url.search))) return

  event.respondWith(
    (async () => {
      try {
        const token = await resolveIdToken()
        if (!token || request.headers.has('authorization')) return fetch(request)

        const headers = new Headers()
        request.headers.forEach((value, key) => headers.append(key, value))
        headers.set('Authorization', `Bearer ${token}`)

        const body = await getBodyContent(request)

        return await fetch(
          new Request(request.url, {
            method: request.method,
            headers,
            mode: 'same-origin',
            credentials: request.credentials,
            cache: request.cache,
            redirect: request.redirect,
            referrer: request.referrer,
            body,
          }),
        )
      } catch {
        return fetch(request)
      }
    })(),
  )
})
