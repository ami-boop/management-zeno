import { useTranslations } from 'next-intl'
import { FC } from 'react'
import { GradeSelector, Grade } from '@/components/ui/grade-selector'

interface ClassSelectorProps {
  grades: Grade[]
  selectedGrade: string
  setSelectedGrade: (grade: string) => void
  selectedClass: string
  setSelectedClass: (cls: string) => void
}

function generateClassNumbers() {
  return Array.from({ length: 11 }, (_, i) => i + 1)
}

const ClassSelector: FC<ClassSelectorProps> = ({
  grades,
  selectedGrade,
  setSelectedGrade,
  selectedClass,
  setSelectedClass,
}) => {
  const t = useTranslations('managementLessons')

  return (
    <GradeSelector
      grades={grades}
      selectedGrade={selectedGrade}
      onGradeChange={(grade) => {
        setSelectedGrade(grade)
        setSelectedClass('')
      }}
      selectedClass={selectedClass}
      onClassChange={setSelectedClass}
      classNumbers={generateClassNumbers()}
      gradeLabel={t('selectGrade')}
      classLabel={t('selectClass')}
    />
  )
}

export default ClassSelector
