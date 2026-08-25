import Client from '@/components/students/Client'
import { API_URL, cacheTTL } from '@/constants'
import { getSessionToken } from '@/utils/getSessionToken'

export interface Student {
  id: number
  name: string
  grade: string
  route: string
  stop: string
  guardian: string
  submited: boolean
  phone: string
}

export default async function StudentsPage() {
  // const students: Student[] = [
  // 	{
  // 		id: 1,
  // 		name: 'Owen Bennett',
  // 		grade: '5th Grade',
  // 		route: 'Route A',
  // 		stop: 'Main Street & Oak Ave',
  // 		guardian: 'Sarah Bennett',
  // 		phone: '+1-555-0123',
  // 	},
  // 	{
  // 		id: 2,
  // 		name: 'Sophia Hughes',
  // 		grade: '3rd Grade',
  // 		route: 'Route B',
  // 		stop: 'School District Office',
  // 		guardian: 'Michael Hughes',
  // 		phone: '+1-555-0124',
  // 	},
  // 	{
  // 		id: 3,
  // 		name: 'Lucas Hayes',
  // 		grade: '6th Grade',
  // 		route: 'Route A',
  // 		stop: 'Pine Street Station',
  // 		guardian: 'Jennifer Hayes',
  // 		phone: '+1-555-0125',
  // 	},
  // 	{
  // 		id: 4,
  // 		name: 'Isabella Reed',
  // 		grade: '4th Grade',
  // 		route: 'Route C',
  // 		stop: 'Community Center',
  // 		guardian: 'David Reed',
  // 		phone: '+1-555-0126',
  // 	},
  // 	{
  // 		id: 5,
  // 		name: 'Caleb Foster',
  // 		grade: '2nd Grade',
  // 		route: 'Route B',
  // 		stop: 'Library Corner',
  // 		guardian: 'Lisa Foster',
  // 		phone: '+1-555-0127',
  // 	},
  // 	{
  // 		id: 6,
  // 		name: 'Emma Watson',
  // 		grade: '1st Grade',
  // 		route: 'Route C',
  // 		stop: 'Park & Ride Lot',
  // 		guardian: 'James Watson',
  // 		phone: '+1-555-0128',
  // 	},
  // ]

  //TODO: create pagination, debounce
  const sessionCookie = await getSessionToken()

  const students: Student[] = await fetch(
    `${API_URL}/students/management`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionCookie}`,
      },
      next: { revalidate: cacheTTL.students }  // 3 часа
    }
  ).then(res => res.json())

  return <Client initialStudents={students} />
}
