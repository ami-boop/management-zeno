/**
 * Generic runtime type guards shared across the app.
 *
 * These are intentionally tiny and dependency-free: they only narrow
 * untrusted / untyped values (e.g. API payloads) so the rest of the code can
 * rely on the narrowed types without `as` casts.
 */

export const isString = (value: unknown): value is string => typeof value === 'string'

export const isNullableString = (value: unknown): value is string | null =>
	value === null || typeof value === 'string'

export const isNullableNumber = (value: unknown): value is number | null =>
	value === null || (typeof value === 'number' && Number.isFinite(value))

/** True for a plain object (not null, not an array). */
export const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Returns the value if it is a valid ISO timestamp string, otherwise null.
 */
export const parseISODateString = (value: unknown): string | null =>
	typeof value === 'string' && !Number.isNaN(Date.parse(value)) ? value : null

/** True for a non-negative finite number (e.g. minutes remaining, counts). */
export const isNonNegativeNumber = (value: unknown): value is number =>
	typeof value === 'number' && Number.isFinite(value) && value >= 0
