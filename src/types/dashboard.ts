export interface DashboardRoute {
  id: string
  name: string
  studentsOnBus: number
  studentsNotMarked: number
  totalStudents: number
  busesNeeded: number
  busesOrdered: number
  status: 'pending' | 'partial' | 'completed'
  lastUpdate: Record<string, number>
  estimatedTime: string
  pendingFriendCount?: number
}
