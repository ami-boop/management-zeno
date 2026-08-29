import { isNullableString, isRecord, isString, parseISODateString } from '@/utils/type-guards'

export interface NotificationMetadata {
	tripId: string | null
	routeId: string | null
}

export interface NotificationData {
	id: string
	type: string
	message: string
	createdAt: string | null
	isRead: boolean
	metadata: NotificationMetadata
}

export function parseNotifications(value: unknown): NotificationData[] {
	if (!Array.isArray(value)) return []
	const notifications: NotificationData[] = []
	for (const item of value) {
		if (!isRecord(item)) continue
		const id = item.id
		const message = item.message
		if (!isString(id) || !isString(message)) continue
		const metadata = isRecord(item.metadata) ? item.metadata : {}
		notifications.push({
			id,
			type: isString(item.type) ? item.type : 'info',
			message,
			createdAt: parseISODateString(item.createdAt),
			isRead: item.isRead === true,
			metadata: {
				tripId: isNullableString(metadata.tripId) ? metadata.tripId : null,
				routeId: isNullableString(metadata.routeId) ? metadata.routeId : null,
			},
		})
	}
	return notifications
}
