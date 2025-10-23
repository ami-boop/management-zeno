import Header from '@/components/Header'
import React from 'react'
import NotificationsListener from '@/components/NotificationListener'

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			<NotificationsListener />
			{children}
			{/* <Footer /> */}
		</>
	)
}
