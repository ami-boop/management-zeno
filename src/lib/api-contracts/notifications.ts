import { isRecord, isString } from '@/utils/type-guards'
import type { Notification } from '@/types/notification'

const VALID_TYPES = ['alert', 'info', 'success'] as const
const VALID_PRIORITIES = ['high', 'medium', 'low'] as const

function parseTimestamp(value: unknown): number | null {
	if (typeof value === 'string') {
		const ms = new Date(value).getTime()
		return Number.isNaN(ms) ? null : ms
	}
	if (typeof value === 'number' && Number.isFinite(value)) {
		return value > 1e12 ? value : value * 1000
	}
	if (isRecord(value)) {
		const seconds = value._seconds ?? value.seconds
		if (typeof seconds === 'number' && Number.isFinite(seconds)) {
			return seconds * 1000
		}
	}
	return null
}

const timePartsFmt = new Intl.DateTimeFormat('en-GB', {
	timeZone: 'Asia/Jerusalem',
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	hourCycle: 'h23',
})

export function formatNotificationTime(value: unknown): string {
	const ms = parseTimestamp(value)
	if (ms === null) return ''
	const parts: Record<string, string> = {}
	for (const part of timePartsFmt.formatToParts(new Date(ms))) {
		if (part.type !== 'literal') parts[part.type] = part.value
	}
	if (!parts.day || !parts.month || !parts.year || !parts.hour || !parts.minute) return ''
	return `${parts.day}.${parts.month}.${parts.year} ${parts.hour}:${parts.minute}`
}

export function parseNotification(value: unknown): Notification | null {
	if (!isRecord(value)) return null
	if (!isString(value.id)) return null
	const type = isString(value.type) && (VALID_TYPES as readonly string[]).includes(value.type)
		? (value.type as Notification['type'])
		: 'info'
	const priority = isString(value.priority) && (VALID_PRIORITIES as readonly string[]).includes(value.priority)
		? (value.priority as Notification['priority'])
		: 'medium'
	return {
		id: value.id,
		message: isString(value.message) ? value.message : '',
		time: formatNotificationTime(value.createdAt),
		type,
		isRead: value.isRead === true,
		priority,
	}
}

export interface NotificationsPage {
	items: Notification[]
	nextCursor: string | null
}

export function parseNotificationsPage(value: unknown): NotificationsPage | null {
	if (!isRecord(value) || !Array.isArray(value.items)) return null
	const items: Notification[] = []
	for (const item of value.items) {
		const parsed = parseNotification(item)
		if (parsed) items.push(parsed)
	}
	return {
		items,
		nextCursor: isString(value.nextCursor) ? value.nextCursor : null,
	}
}

export function parseNotifications(value: unknown): Notification[] {
	if (!Array.isArray(value)) return []
	const out: Notification[] = []
	for (const item of value) {
		const parsed = parseNotification(item)
		if (parsed) out.push(parsed)
	}
	return out
}
