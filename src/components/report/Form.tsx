'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Status from './Status'
import Success from './Success'
import Notice from './Notice'
import { Loader2 } from 'lucide-react'
import setStudentReturnStatus from '@/app/actions/setStudentsReturnStatus'

const needsProfile = (grade: string) =>
  ['tet', 'yud', 'yud_alef', 'yud_bet'].includes(grade)

interface ManagementReportFormProps {
  grades: { key: string; hebrew: string }[]
  profiles: { key: string; label: string }[]
  timeOptions: string[]
  classNumbers: number[]
}

export interface reportData {
  parallel: string | null
  className: string | null
  megama: string | null
  time: string | null
}

export default function Form({
  grades,
  profiles,
  timeOptions,
  classNumbers,
}: ManagementReportFormProps) {
  const t = useTranslations('managementReport')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedParallel, setSelectedParallel] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSubmitting(false)
    setIsSubmitted(true)
    const reportData: reportData = {
      parallel: selectedParallel ? selectedParallel : null,
      className: selectedParallel ? null : `${selectedGrade}_${selectedClass}`,
      megama: selectedProfile,
      time: selectedTime,
    }
    await setStudentReturnStatus(reportData)
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setSelectedGrade(null)
    setSelectedClass(null)
    setSelectedProfile(null)
    setSelectedTime(null)
    setSelectedParallel('')
  }

  if (isSubmitted) {
    return <Success onReset={handleReset} />
  }

  return (
    <>
      <Status />
      {/* Parallel Selection */}
      <div className='relative mb-6'>
        <label
          htmlFor='parallel-select'
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          {t('parallelLabel')}
        </label>
        <select
          value={selectedParallel}
          onChange={e => {
            setSelectedParallel(e.target.value)
            if (e.target.value) {
              setSelectedGrade(null)
              setSelectedClass(null)
              setSelectedProfile(null)
              setSelectedTime(null)
            }
          }}
          className='w-full px-3 py-2 border border-amber-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500'
        >
          <option value=''>{t('selectParallel')}</option>
          {grades.map(grade => (
            <option key={grade.key} value={grade.key} data-testid='parallel-option'>
              {t('parallelOption', { grade: grade.hebrew })}
            </option>
          ))}
        </select>
      </div>
      {/* Individual Class Selection */}
      {!selectedParallel && (
        <>
          {/* Grade Selection */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              {t('gradeLabel')}
            </label>
            <div className='grid grid-cols-4 gap-2'>
              {grades.map(grade => (
                <button
                  key={grade.key}
                  type='button'
                  onClick={() => {
                    setSelectedGrade(grade.key)
                    setSelectedClass(null)
                    setSelectedProfile(null)
                    setSelectedTime(null)
                  }}
                  className={`p-3 text-lg font-medium rounded-md border transition-colors duration-200 ${selectedGrade === grade.key
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  data-testid='select-parallel'
                >
                  {grade.hebrew}
                </button>
              ))}
            </div>
          </div>
          {/* Class Number Selection */}
          {selectedGrade && (
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                {t('classLabel')}
              </label>
              <div className='grid grid-cols-6 gap-2'>
                {classNumbers.map(number => (
                  <button
                    key={number}
                    type='button'
                    onClick={() => setSelectedClass(number.toString())}
                    className={`p-2 text-sm font-medium rounded-md border transition-colors duration-200 ${selectedClass === number.toString()
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {grades.find(g => g.key === selectedGrade)?.hebrew}
                    {number}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Profile Selection */}
          {selectedGrade && selectedClass && needsProfile(selectedGrade) && (
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                {t('profileLabel')}
              </label>
              <div className='grid grid-cols-1 gap-2'>
                <button
                  type='button'
                  onClick={() => setSelectedProfile('all')}
                  className={`p-3 text-sm font-medium rounded-md border transition-colors duration-200 text-right ${selectedProfile === 'all'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {t('selectAllProfiles')}
                </button>
                {profiles.map(profile => (
                  <button
                    key={profile.key}
                    type='button'
                    onClick={() => setSelectedProfile(profile.key)}
                    className={`p-3 text-sm font-medium rounded-md border transition-colors duration-200 text-right ${selectedProfile === profile.key
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    data-testid='select-profile'
                  >
                    {profile.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      {/* Time Selection */}
      {(selectedClass || selectedParallel) &&
        (selectedParallel ||
          !selectedGrade ||
          !needsProfile(selectedGrade) ||
          selectedProfile) && (
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              {t('timeLabel')}
            </label>
            <div className='grid grid-cols-3 gap-2'>
              {timeOptions.map(time => (
                <button
                  key={time}
                  type='button'
                  onClick={() => setSelectedTime(time)}
                  className={`p-3 text-sm font-medium rounded-md border transition-colors duration-200 text-center ${selectedTime === time
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  data-testid='select-time'
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={
          isSubmitting ||
          (selectedParallel === ''
            ? !!(
              !selectedGrade ||
              !selectedClass ||
              (needsProfile(selectedGrade) && !selectedProfile) ||
              !selectedTime
            )
            : !selectedTime)
        }
        className={`w-full py-3 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${isSubmitting ||
          (!selectedParallel &&
            (!selectedGrade ||
              !selectedClass ||
              (needsProfile(selectedGrade) && !selectedProfile) ||
              !selectedTime)) ||
          (selectedParallel && !selectedTime)
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
      >
        {isSubmitting ? (
          <div className='flex items-center justify-center'>
            <Loader2 className='animate-spin -ml-1 mr-3 h-4 w-4 text-white' />
            {t('submitting')}
          </div>
        ) : (
          t('reportButton')
        )}
      </button>
      <Notice />
    </>
  )
}
