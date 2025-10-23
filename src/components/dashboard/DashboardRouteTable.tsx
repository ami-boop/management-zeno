import { FC } from 'react'
import { Bus, Users, AlertTriangle, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Route {
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
}

interface DashboardRouteTableProps {
	routes: Route[]
	onOrderBuses: (routeId: string, count: number) => void
	getStatusColor: (status: Route['status']) => string
	getStatusDot: (status: Route['status']) => string
	getStatusText: (status: Route['status']) => string
}

const DashboardRouteTable: FC<DashboardRouteTableProps> = ({
	routes,
	onOrderBuses,
	getStatusColor,
	getStatusDot,
	getStatusText,
}) => {
	const t = useTranslations('Dashboard')
	return (
		<div className='overflow-x-auto'>
			<table className='min-w-full divide-y divide-gray-200'>
				<thead className='bg-gray-50'>
					<tr>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							<Bus className='inline w-4 h-4 mr-1' /> {t('columns.route')}
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							<Users className='inline w-4 h-4 mr-1' />{' '}
							{t('columns.studentsOnBus')}
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							<AlertTriangle className='inline w-4 h-4 mr-1' />{' '}
							{t('columns.notMarked')}
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							{t('columns.totalStudents')}
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							<Bus className='inline w-4 h-4 mr-1' /> {t('columns.busesNeeded')}
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							<CheckCircle className='inline w-4 h-4 mr-1' />{' '}
							{t('columns.status')}
						</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
							{t('columns.actions')}
						</th>
					</tr>
				</thead>
				<tbody className='bg-white divide-y divide-gray-200'>
					{routes.map(route => (
						<tr
							key={route.id}
							className='hover:bg-gray-50 transition-colors duration-150'
						>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div>
									<div className='text-sm font-medium text-gray-900'>
										{route.name}
									</div>
									<div className='text-xs text-gray-500'>
										{t('columns.departure')}: {route.estimatedTime}
									</div>
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='text-sm font-semibold text-emerald-600 mr-3'>
										{route.studentsOnBus}
									</div>
									<div className='flex-1 max-w-20'>
										<div className='w-full bg-gray-200 rounded-full h-2'>
											<div
												className='bg-emerald-500 h-2 rounded-full transition-all duration-300'
												style={{
													width: `${Math.min(
														100,
														Math.max(
															0,
															(route.studentsOnBus / route.totalStudents) * 100
														)
													)}%`,
												}}
											></div>
										</div>
									</div>
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<span
									className={`text-sm font-medium ${
										route.studentsNotMarked > 0
											? 'text-amber-600'
											: 'text-gray-500'
									}`}
								>
									{route.studentsNotMarked}
								</span>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium'>
								{route.totalStudents}
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center space-x-3'>
									<span className='text-sm text-gray-900 min-w-10'>
										{route.busesOrdered}/{route.busesNeeded}
									</span>
									<div className='flex-1 max-w-16'>
										<div className='w-full bg-gray-200 rounded-full h-2'>
											<div
												className='bg-blue-500 h-2 rounded-full transition-all duration-300'
												style={{
													width: `${Math.min(
														100,
														Math.max(
															0,
															(route.busesOrdered / route.busesNeeded) * 100
														)
													)}%`,
												}}
											></div>
										</div>
									</div>
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
										route.status
									)}`}
								>
									<div
										className={`w-1.5 h-1.5 rounded-full mr-1.5 ${getStatusDot(
											route.status
										)}`}
									></div>
									{getStatusText(route.status)}
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
								{route.busesOrdered < route.busesNeeded && (
									<div className='flex items-center space-x-2'>
										<button
											onClick={() => onOrderBuses(route.id, 1)}
											className='inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
										>
											+1 <Bus className='w-3 h-3 ml-1' />
										</button>
										{route.busesOrdered + 2 <= route.busesNeeded && (
											<button
												onClick={() =>
													onOrderBuses(
														route.id,
														route.busesNeeded - route.busesOrdered
													)
												}
												className='inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
											>
												{t('orderAll')}
											</button>
										)}
									</div>
								)}
								{route.busesOrdered === route.busesNeeded && (
									<span className='text-xs text-emerald-600 font-medium'>
										{t('allOrdered')}
									</span>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default DashboardRouteTable
