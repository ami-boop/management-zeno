// Mirror of backend `utils/classMap.ts` — class IDs ↔ Hebrew display names.
// Keep in sync with Zeno-functions/fastify-functions/utils/classMap.ts.

const CLASS_MAP: Record<string, string> = {
	alef_1: 'א׳ 1', alef_2: 'א׳ 2', alef_3: 'א׳ 3', alef_4: 'א׳ 4', alef_5: 'א׳ 5',
	bet_1: 'ב׳ 1', bet_2: 'ב׳ 2', bet_3: 'ב׳ 3', bet_4: 'ב׳ 4', bet_5: 'ב׳ 5',
	gimel_1: 'ג׳ 1', gimel_2: 'ג׳ 2', gimel_3: 'ג׳ 3', gimel_4: 'ג׳ 4', gimel_5: 'ג׳ 5',
	dalet_1: 'ד׳ 1', dalet_2: 'ד׳ 2', dalet_3: 'ד׳ 3', dalet_4: 'ד׳ 4', dalet_5: 'ד׳ 5',
	heh_1: 'ה׳ 1', heh_2: 'ה׳ 2', heh_3: 'ה׳ 3', heh_4: 'ה׳ 4', heh_5: 'ה׳ 5',
	vav_1: 'ו׳ 1', vav_2: 'ו׳ 2', vav_3: 'ו׳ 3', vav_4: 'ו׳ 4', vav_5: 'ו׳ 5',
	zayin_1: 'ז׳ 1', zayin_2: 'ז׳ 2', zayin_3: 'ז׳ 3', zayin_4: 'ז׳ 4', zayin_5: 'ז׳ 5',
	het_1: 'ח׳ 1', het_2: 'ח׳ 2', het_3: 'ח׳ 3', het_4: 'ח׳ 4', het_5: 'ח׳ 5',
	tet_1: 'ט׳ 1', tet_2: 'ט׳ 2', tet_3: 'ט׳ 3', tet_4: 'ט׳ 4', tet_5: 'ט׳ 5',
	tet_6: 'ט׳ 6', tet_7: 'ט׳ 7', tet_8: 'ט׳ 8', tet_9: 'ט׳ 9', tet_10: 'ט׳ 10',
	yud_1: 'י׳ 1', yud_2: 'י׳ 2', yud_3: 'י׳ 3', yud_4: 'י׳ 4', yud_5: 'י׳ 5',
	yud_6: 'י׳ 6', yud_7: 'י׳ 7', yud_8: 'י׳ 8', yud_9: 'י׳ 9', yud_10: 'י׳ 10', yud_11: 'י׳ 11',
	yud_alef_1: 'יא׳ 1', yud_alef_2: 'יא׳ 2', yud_alef_3: 'יא׳ 3', yud_alef_4: 'יא׳ 4',
	yud_alef_5: 'יא׳ 5', yud_alef_6: 'יא׳ 6', yud_alef_7: 'יא׳ 7', yud_alef_8: 'יא׳ 8',
	yud_alef_9: 'יא׳ 9', yud_alef_10: 'יא׳ 10', yud_alef_11: 'יא׳ 11',
	yud_bet_1: 'יב׳ 1', yud_bet_2: 'יב׳ 2', yud_bet_3: 'יב׳ 3', yud_bet_4: 'יב׳ 4',
	yud_bet_5: 'יב׳ 5', yud_bet_6: 'יב׳ 6', yud_bet_7: 'יב׳ 7', yud_bet_8: 'יב׳ 8',
	yud_bet_9: 'יב׳ 9', yud_bet_10: 'יב׳ 10', yud_bet_11: 'יב׳ 11',
}

const GRADE_ORDER = [
	'alef', 'bet', 'gimel', 'dalet', 'heh', 'vav', 'zayin', 'het', 'tet', 'yud', 'yud_alef', 'yud_bet',
]

export interface ClassOption {
	id: string
	label: string
}

/** All known classes, ordered by grade then class number. */
export const ALL_CLASS_OPTIONS: ClassOption[] = Object.entries(CLASS_MAP)
	.map(([id, label]) => ({ id, label }))
	.sort((a, b) => {
		const [gradeA, numA] = splitClassId(a.id)
		const [gradeB, numB] = splitClassId(b.id)
		const orderDiff = GRADE_ORDER.indexOf(gradeA) - GRADE_ORDER.indexOf(gradeB)
		if (orderDiff !== 0) return orderDiff
		return numA - numB
	})

function splitClassId(id: string): [string, number] {
	const match = id.match(/^(.*)_(\d+)$/)
	if (!match) return [id, 0]
	return [match[1], Number(match[2])]
}

/** Hebrew display label for a raw class id; falls back to the id itself. */
export function classToHebrew(classId: string | null | undefined): string {
	if (!classId) return ''
	return CLASS_MAP[classId] ?? classId
}
