'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
	onSnapshot,
	collection,
	query,
	orderBy,
	Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import dayjs from 'dayjs'

export default function NotificationsListener() {
	const seenIds = useRef<Set<string>>(new Set())
	const [initTime] = useState(() => dayjs())

	useEffect(() => {
		const q = query(collection(db, 'notifications'), orderBy('time', 'desc'))

		// TODO: create react context to make a red dot on notification mark in header

		const unsubscribe = onSnapshot(q, snapshot => {
			snapshot.docChanges().forEach(change => {
				const doc = change.doc
				const data = doc.data()
				const id = doc.id

				if (change.type === 'added' && !seenIds.current.has(id)) {
					seenIds.current.add(id)

					const createdAt = data.createdAt as Timestamp | undefined
					if (createdAt && dayjs(createdAt.toDate()).isBefore(initTime)) {
						return
					}

					if (data.isRead === false) {
						const title =
							data.type === 'alert' ? '🚨 Внимание!' : '🔔 Уведомление'
						const description =
							data.message + (data.time ? ` (${data.time})` : '')

						switch (data.priority) {
							case 'high':
								toast.error(title, { description })
								break
							case 'medium':
								toast.warning(title, { description })
								break
							case 'low':
							default:
								toast.info(title, { description })
								break
						}
					} else {
					}
				}
			})
		})

		return () => {
			unsubscribe()
		}
	}, [initTime])

	return null
}
