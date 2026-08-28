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

let authReady = new Promise(resolve => {
  const unsubscribe = firebase.auth().onAuthStateChanged(() => {
    resolve()
    unsubscribe()
  })
})

async function getFreshIdToken() {
  await authReady
  const user = firebase.auth().currentUser
  if (!user) return null
  try {
    return await user.getIdToken()
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
  return (await askClientsForToken()) || (await getFreshIdToken())
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
