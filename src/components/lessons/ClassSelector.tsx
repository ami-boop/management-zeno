import { FC } from 'react'

interface ClassSelectorProps {
	grades: { key: string; label: string; hebrew: string }[]
	selectedGrade: string
	setSelectedGrade: (grade: string) => void
	selectedClass: string
	setSelectedClass: (cls: string) => void
	t: (key: string) => string
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
	t,
}) => (
	<>
		<div>
			<label className='block text-sm font-medium text-gray-700 mb-3'>
				{t('selectGrade')}
			</label>
			<div className='grid grid-cols-4 gap-2'>
				{grades.map(grade => (
					<button
						key={grade.key}
						type='button'
						onClick={() => {
							setSelectedGrade(grade.key)
							setSelectedClass('')
						}}
						className={`p-3 text-lg font-medium rounded-md border transition-colors duration-200 ${
							selectedGrade === grade.key
								? 'bg-blue-50 text-blue-700 border-blue-200'
								: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
						}`}
					>
						{grade.hebrew}
					</button>
				))}
			</div>
		</div>
		{selectedGrade && (
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-3'>
					{t('selectClass')}
				</label>
				<div className='grid grid-cols-6 gap-2'>
					{generateClassNumbers().map(number => (
						<button
							key={number}
							type='button'
							onClick={() => setSelectedClass(number.toString())}
							className={`p-2 text-sm font-medium rounded-md border transition-colors duration-200 ${
								selectedClass === number.toString()
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
	</>
)

export default ClassSelector
