import ScheduleViewerClient from '@/components/lessons/ScheduleViewerClient'

const grades = [
	{ key: 'alef', label: 'א׳', hebrew: 'א׳' },
	{ key: 'bet', label: 'ב׳', hebrew: 'ב׳' },
	{ key: 'gimel', label: 'ג׳', hebrew: 'ג׳' },
	{ key: 'dalet', label: 'ד׳', hebrew: 'ד׳' },
	{ key: 'he', label: 'ה׳', hebrew: 'ה׳' },
	{ key: 'vav', label: 'ו׳', hebrew: 'ו׳' },
	{ key: 'zayin', label: 'ז׳', hebrew: 'ז׳' },
	{ key: 'het', label: 'ח׳', hebrew: 'ח׳' },
	{ key: 'tet', label: 'ט׳', hebrew: 'ט׳' },
	{ key: 'yud', label: 'י׳', hebrew: 'י׳' },
	{ key: 'yud_alef', label: 'יא׳', hebrew: 'יא׳' },
	{ key: 'yud_bet', label: 'יב׳', hebrew: 'יב׳' },
]

const days = [
	{ key: 'sunday', label: 'Sunday', hebrew: 'א׳' },
	{ key: 'monday', label: 'Monday', hebrew: 'ב׳' },
	{ key: 'tuesday', label: 'Tuesday', hebrew: 'ג׳' },
	{ key: 'wednesday', label: 'Wednesday', hebrew: 'ד׳' },
	{ key: 'thursday', label: 'Thursday', hebrew: 'ה׳' },
	{ key: 'friday', label: 'Friday', hebrew: 'ו׳' },
]

const times: Record<number, string> = {
	1: '08:30 - 09:10',
	2: '09:10 - 09:50',
	3: '10:10 - 10:20',
	4: '10:20 - 11:05',
	5: '11:10 - 11:50',
	6: '12:00 - 12:40',
	7: '12:45 - 13:30',
	8: '14:00 - 14:45',
	9: '14:50 - 15:35',
}

export default function ManagementLessonsPage() {
	return <ScheduleViewerClient grades={grades} days={days} times={times} />
}
