'use client'

import { FC } from 'react'
import { SelectButton } from './select-button'

export interface Grade {
  key: string
  label?: string
  hebrew: string
}

interface GradeSelectorProps {
  grades: Grade[]
  selectedGrade: string | null
  onGradeChange: (grade: string) => void
  selectedClass?: string | null
  onClassChange?: (cls: string) => void
  classNumbers?: number[]
  gradeLabel?: string
  classLabel?: string
  gradeColumns?: number
  classColumns?: number
}

export const GradeSelector: FC<GradeSelectorProps> = ({
  grades,
  selectedGrade,
  onGradeChange,
  selectedClass,
  onClassChange,
  classNumbers,
  gradeLabel,
  classLabel,
  gradeColumns = 4,
  classColumns = 6,
}) => {
  return (
    <>
      <div>
        {gradeLabel && (
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {gradeLabel}
          </label>
        )}
        <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${gradeColumns}, minmax(0, 1fr))` }}>
          {grades.map((grade) => (
            <SelectButton
              key={grade.key}
              selected={selectedGrade === grade.key}
              onClick={() => onGradeChange(grade.key)}
              size="md"
              data-testid="select-grade"
            >
              {grade.hebrew}
            </SelectButton>
          ))}
        </div>
      </div>

      {selectedGrade && classNumbers && onClassChange && (
        <div className="mt-4">
          {classLabel && (
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {classLabel}
            </label>
          )}
          <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${classColumns}, minmax(0, 1fr))` }}>
            {classNumbers.map((number) => (
              <SelectButton
                key={number}
                selected={selectedClass === number.toString()}
                onClick={() => onClassChange(number.toString())}
                size="sm"
                data-testid="select-class"
              >
                {grades.find((g) => g.key === selectedGrade)?.hebrew}
                {number}
              </SelectButton>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default GradeSelector
