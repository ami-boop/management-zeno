import { buildApiUrl, authHeaders } from '@/utils/api'

type ApiGetOptions = {
	params?: Record<string, string | number | undefined>
}

export class ApiError extends Error {
	status: number

	constructor(endpoint: string, status: number) {
		super(`api ${endpoint} failed: ${status}`)
		this.status = status
	}
}

export async function apiGet(
	endpoint: string,
	token: string,
	options?: ApiGetOptions,
): Promise<unknown> {
	const response = await fetch(buildApiUrl(endpoint, options?.params), {
		headers: authHeaders(token),
		cache: 'no-store',
	})
	if (!response.ok) throw new ApiError(endpoint, response.status)

	// Guard against proxies returning 200 with an empty/malformed body:
	// parse inside a try so a JSON error can never crash the caller — it
	// degrades to null instead (parse* functions then return null).
	try {
		return await response.json()
	} catch {
		return null
	}
}

export async function apiPost<TBody>(
	endpoint: string,
	token: string,
	body: TBody,
): Promise<{ ok: boolean; status: number; data: unknown | null }> {
	return apiSend('POST', endpoint, token, body)
}

export async function apiPut<TBody>(
	endpoint: string,
	token: string,
	body: TBody,
): Promise<{ ok: boolean; status: number; data: unknown | null }> {
	return apiSend('PUT', endpoint, token, body)
}

export async function apiDelete(
	endpoint: string,
	token: string,
): Promise<{ ok: boolean; status: number; data: unknown | null }> {
	return apiSend('DELETE', endpoint, token)
}

async function apiSend<TBody>(
	method: 'POST' | 'PUT' | 'DELETE',
	endpoint: string,
	token: string,
	body?: TBody,
): Promise<{ ok: boolean; status: number; data: unknown | null }> {
	const response = await fetch(buildApiUrl(endpoint), {
		method,
		headers: authHeaders(token),
		body: body === undefined ? undefined : JSON.stringify(body),
		cache: 'no-store',
	})
	let data: unknown = null
	try {
		data = await response.json()
	} catch {
		data = null
	}
	return { ok: response.ok, status: response.status, data }
}
