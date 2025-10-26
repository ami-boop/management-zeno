import LessonCard from './LessonCard'

interface ScheduleGridProps {
  currentLessons: ({ name: string; teacher: string; color: string } | null)[]
  getLessonTime: (index: number) => string
}

const ScheduleGrid = ({
  currentLessons,
  getLessonTime,
}: ScheduleGridProps) => (
  <div className='space-y-4'>
    {currentLessons.map((lesson, index) => (
      <LessonCard
        key={index}
        lesson={lesson}
        index={index}
        getLessonTime={getLessonTime}
      />
    ))}
  </div>
)

export default ScheduleGrid
