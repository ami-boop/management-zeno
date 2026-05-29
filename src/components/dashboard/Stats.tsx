import { useTranslations } from 'next-intl'
import { Users, Car, Bus } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'

interface Stat {
  label: string
  value: number
  change?: string
}

interface DashboardStatsProps {
  stats: Stat[]
}

const iconMap: Record<string, React.ReactNode> = {
  studentsOnBus: (
    <Users className="w-4 h-4 bg-emerald-500 rounded-full p-0.5" />
  ),
  studentsNotMarked: (
    <Car className="w-4 h-4 bg-amber-500 rounded-full p-0.5" />
  ),
  busesNeeded: <Bus className="w-4 h-4 bg-blue-500 rounded-full p-0.5" />,
}

const Stats = ({ stats }: DashboardStatsProps) => {
  const t = useTranslations('Dashboard')

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={t(`stats.${stat.label}`)}
          value={stat.value}
          icon={iconMap[stat.label]}
        />
      ))}
    </div>
  )
}

export default Stats
