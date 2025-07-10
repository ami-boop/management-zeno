import { NextRequest } from 'next/server'

type Lesson = {
	name: string
	teacher: string
	color: string
}

type Day = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'

type ClassSchedule = {
	className: string
	schedule: Record<Day, (Lesson | null)[]>
}

type ScheduleData = Record<string, ClassSchedule>

const mockScheduleData: ScheduleData = {
	tet_1: {
		className: 'ט׳1',
		schedule: {
			sunday: [
				null, // 0 урок - пустой
				{ name: 'מתמטיקה', teacher: 'רחל כהן', color: '#3B82F6' },
				{ name: 'עברית', teacher: 'דוד לוי', color: '#10B981' },
				{ name: 'אנגלית', teacher: 'Sarah Johnson', color: '#F59E0B' },
				{ name: 'היסטוריה', teacher: 'משה אברהם', color: '#8B5CF6' },
				{ name: 'מדעים', teacher: 'ליאה שמיר', color: '#EF4444' },
				{ name: 'גיאוגרפיה', teacher: 'יוסף דוד', color: '#06B6D4' },
				{ name: 'ספורט', teacher: 'אמיר כהן', color: '#84CC16' },
				{ name: 'אמנות', teacher: 'נועה לוין', color: '#F97316' },
			],
			monday: [
				null,
				{ name: 'עברית', teacher: 'דוד לוי', color: '#10B981' },
				{ name: 'מתמטיקה', teacher: 'רחל כהן', color: '#3B82F6' },
				{ name: 'מדעים', teacher: 'ליאה שמיר', color: '#EF4444' },
				{ name: 'אנגלית', teacher: 'Sarah Johnson', color: '#F59E0B' },
				{ name: 'ספורט', teacher: 'אמיר כהן', color: '#84CC16' },
				{ name: 'היסטוריה', teacher: 'משה אברהם', color: '#8B5CF6' },
				{ name: 'אמנות', teacher: 'נועה לוין', color: '#F97316' },
				null,
			],
			tuesday: [
				null,
				{ name: 'מתמטיקה', teacher: 'רחל כהן', color: '#3B82F6' },
				{ name: 'אנגלית', teacher: 'Sarah Johnson', color: '#F59E0B' },
				{ name: 'גיאוגרפיה', teacher: 'יוסף דוד', color: '#06B6D4' },
				{ name: 'עברית', teacher: 'דוד לוי', color: '#10B981' },
				{ name: 'מדעים', teacher: 'ליאה שמיר', color: '#EF4444' },
				{ name: 'מוסיקה', teacher: 'עינת כהן', color: '#F97316' },
				{ name: 'ספורט', teacher: 'אמיר כהן', color: '#84CC16' },
				null,
			],
			wednesday: [
				null,
				{ name: 'עברית', teacher: 'דוד לוי', color: '#10B981' },
				{ name: 'מתמטיקה', teacher: 'רחל כהן', color: '#3B82F6' },
				{ name: 'אנגלית', teacher: 'Sarah Johnson', color: '#F59E0B' },
				{ name: 'היסטוריה', teacher: 'משה אברהם', color: '#8B5CF6' },
				{ name: 'גיאוגרפיה', teacher: 'יוסף דוד', color: '#06B6D4' },
				{ name: 'אמנות', teacher: 'נועה לוין', color: '#F97316' },
				{ name: 'מדעים', teacher: 'ליאה שמיר', color: '#EF4444' },
				null,
			],
			thursday: [
				null,
				{ name: 'מתמטיקה', teacher: 'רחל כהן', color: '#3B82F6' },
				{ name: 'עברית', teacher: 'דוד לוי', color: '#10B981' },
				{ name: 'ספורט', teacher: 'אמיר כהן', color: '#84CC16' },
				{ name: 'אנגלית', teacher: 'Sarah Johnson', color: '#F59E0B' },
				{ name: 'מדעים', teacher: 'ליאה שמיר', color: '#EF4444' },
				{ name: 'גיאוגרפיה', teacher: 'יוסף דוד', color: '#06B6D4' },
				{ name: 'אמנות', teacher: 'נועה לוין', color: '#F97316' },
				{ name: 'מוסיקה', teacher: 'עינת כהן', color: '#F97316' },
			],
			friday: [
				null,
				{ name: 'עברית', teacher: 'דוד לוי', color: '#10B981' },
				{ name: 'מתמטיקה', teacher: 'רחל כהן', color: '#3B82F6' },
				{ name: 'אנגלית', teacher: 'Sarah Johnson', color: '#F59E0B' },
				{ name: 'היסטוריה', teacher: 'משה אברהם', color: '#8B5CF6' },
				{ name: 'מדעים', teacher: 'ליאה שמיר', color: '#EF4444' },
				null,
				null,
				null,
			],
		},
	},
	yud_alef_3: {
		className: 'יא׳3',
		schedule: {
			sunday: [
				null, // 0 урок - пустой
				{ name: 'פיזיקה', teacher: 'ד"ר אלכס פרידמן', color: '#3B82F6' },
				{ name: 'מחשבים', teacher: 'תומר בן-דוד', color: '#1E40AF' },
				{ name: 'מתמטיקה מתקדמת', teacher: 'רות גולדברג', color: '#7C3AED' },
				{ name: 'אנגלית', teacher: 'Michael Smith', color: '#F59E0B' },
				{ name: 'עברית', teacher: 'חנה רוזנברג', color: '#10B981' },
				{ name: 'אזרחות', teacher: 'יעקב שפירא', color: '#EF4444' },
				null, // 7 урок - пустой
				null, // 8 урок - пустой
			],
			monday: [
				null,
				{ name: 'מתמטיקה מתקדמת', teacher: 'רות גולדברג', color: '#7C3AED' },
				{ name: 'פיזיקה', teacher: 'ד"ר אלכס פרידמן', color: '#3B82F6' },
				{ name: 'מחשבים', teacher: 'תומר בן-דוד', color: '#1E40AF' },
				{ name: 'עברית', teacher: 'חנה רוזנברג', color: '#10B981' },
				{ name: 'אנגלית', teacher: 'Michael Smith', color: '#F59E0B' },
				{ name: 'היסטוריה', teacher: 'דוד שמיר', color: '#8B5CF6' },
				null,
				null,
			],
			tuesday: [
				null,
				{ name: 'מחשבים', teacher: 'תומר בן-דוד', color: '#1E40AF' },
				{ name: 'פיזיקה', teacher: 'ד"ר אלכס פרידמן', color: '#3B82F6' },
				{ name: 'מתמטיקה מתקדמת', teacher: 'רות גולדברג', color: '#7C3AED' },
				{ name: 'אנגלית', teacher: 'Michael Smith', color: '#F59E0B' },
				{ name: 'אזרחות', teacher: 'יעקב שפירא', color: '#EF4444' },
				{ name: 'עברית', teacher: 'חנה רוזנברג', color: '#10B981' },
				null,
				null,
			],
			wednesday: [
				null,
				{ name: 'פיזיקה', teacher: 'ד"ר אלכס פרידמן', color: '#3B82F6' },
				{ name: 'מתמטיקה מתקדמת', teacher: 'רות גולדברג', color: '#7C3AED' },
				{ name: 'מחשבים', teacher: 'תומר בן-דוד', color: '#1E40AF' },
				{ name: 'עברית', teacher: 'חנה רוזנברג', color: '#10B981' },
				{ name: 'אנגלית', teacher: 'Michael Smith', color: '#F59E0B' },
				{ name: 'ספורט', teacher: 'גיל מור', color: '#84CC16' },
				null,
				null,
			],
			thursday: [
				null,
				{ name: 'מתמטיקה מתקדמת', teacher: 'רות גולדברג', color: '#7C3AED' },
				{ name: 'פיזיקה', teacher: 'ד"ר אלכס פרידמן', color: '#3B82F6' },
				{ name: 'מחשבים', teacher: 'תומר בן-דוד', color: '#1E40AF' },
				{ name: 'אנגלית', teacher: 'Michael Smith', color: '#F59E0B' },
				{ name: 'עברית', teacher: 'חנה רוזנברג', color: '#10B981' },
				{ name: 'אזרחות', teacher: 'יעקב שפירא', color: '#EF4444' },
				null,
				null,
			],
			friday: [
				null,
				{ name: 'עברית', teacher: 'חנה רוזנברg', color: '#10B981' },
				{ name: 'מתמטיקה מתקדמת', teacher: 'רות גולדברג', color: '#7C3AED' },
				{ name: 'פיזיקה', teacher: 'ד"ר אלכס פרידמן', color: '#3B82F6' },
				{ name: 'אנגלית', teacher: 'Michael Smith', color: '#F59E0B' },
				null,
				null,
				null,
				null,
			],
		},
	},
	het_5: {
		className: 'ח׳5',
		schedule: {
			sunday: [
				null, // 0 урок - пустой
				{ name: 'עברית', teacher: 'מרים כהן', color: '#10B981' },
				{ name: 'מתמטיקה', teacher: 'אברהם לוי', color: '#3B82F6' },
				{ name: 'אנגלית', teacher: 'Lisa Brown', color: '#F59E0B' },
				{ name: 'מדעים', teacher: 'שרה אדמס', color: '#EF4444' },
				{ name: 'היסטוריה', teacher: 'דני שלום', color: '#8B5CF6' },
				{ name: 'גיאוגרפיה', teacher: 'רונן ברק', color: '#06B6D4' },
				{ name: 'ספורט', teacher: 'גיל מור', color: '#84CC16' },
				{ name: 'מוסיקה', teacher: 'עינת כהן', color: '#F97316' },
			],
			monday: [
				null,
				{ name: 'מתמטיקה', teacher: 'אברהם לוי', color: '#3B82F6' },
				{ name: 'עברית', teacher: 'מרים כהן', color: '#10B981' },
				{ name: 'מדעים', teacher: 'שרה אדמס', color: '#EF4444' },
				{ name: 'אנגלית', teacher: 'Lisa Brown', color: '#F59E0B' },
				{ name: 'ספורט', teacher: 'גיל מור', color: '#84CC16' },
				{ name: 'היסטוריה', teacher: 'דני שלום', color: '#8B5CF6' },
				{ name: 'אמנות', teacher: 'נועה לוין', color: '#F97316' },
				null,
			],
			tuesday: [
				null,
				{ name: 'עברית', teacher: 'מרים כהן', color: '#10B981' },
				{ name: 'מתמטיקה', teacher: 'אברהם לוי', color: '#3B82F6' },
				{ name: 'אנגלית', teacher: 'Lisa Brown', color: '#F59E0B' },
				{ name: 'גיאוגרפיה', teacher: 'רונן ברק', color: '#06B6D4' },
				{ name: 'מדעים', teacher: 'שרה אדמס', color: '#EF4444' },
				{ name: 'מוסיקה', teacher: 'עינת כהן', color: '#F97316' },
				{ name: 'ספורט', teacher: 'גיל מור', color: '#84CC16' },
				null,
			],
			wednesday: [
				null,
				{ name: 'מתמטיקה', teacher: 'אברהם לוי', color: '#3B82F6' },
				{ name: 'עברית', teacher: 'מרים כהן', color: '#10B981' },
				{ name: 'מדעים', teacher: 'שרה אדמס', color: '#EF4444' },
				{ name: 'אנגלית', teacher: 'Lisa Brown', color: '#F59E0B' },
				{ name: 'היסטוריה', teacher: 'דני שלום', color: '#8B5CF6' },
				{ name: 'גיאוגרפיה', teacher: 'רונן ברק', color: '#06B6D4' },
				{ name: 'אמנות', teacher: 'נועה לוין', color: '#F97316' },
				null,
			],
			thursday: [
				null,
				{ name: 'עברית', teacher: 'מרים כהן', color: '#10B981' },
				{ name: 'מתמטיקה', teacher: 'אברהם לוי', color: '#3B82F6' },
				{ name: 'אנגלית', teacher: 'Lisa Brown', color: '#F59E0B' },
				{ name: 'ספורט', teacher: 'גיל מור', color: '#84CC16' },
				{ name: 'מדעים', teacher: 'שרה אדמס', color: '#EF4444' },
				{ name: 'היסטוריה', teacher: 'דני שלום', color: '#8B5CF6' },
				{ name: 'מוסיקה', teacher: 'עינת כהן', color: '#F97316' },
				null,
			],
			friday: [
				null,
				{ name: 'עברית', teacher: 'מרים כהן', color: '#10B981' },
				{ name: 'מתמטיקה', teacher: 'אברהם לוי', color: '#3B82F6' },
				{ name: 'אנגלית', teacher: 'Lisa Brown', color: '#F59E0B' },
				{ name: 'מדעים', teacher: 'שרה אדמס', color: '#EF4444' },
				{ name: 'גיאוגרפיה', teacher: 'רונן ברק', color: '#06B6D4' },
				null,
				null,
				null,
			],
		},
	},
}

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const key = searchParams.get('key')
	if (!key || !mockScheduleData[key]) {
		return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
	}
	return new Response(JSON.stringify(mockScheduleData[key]), { status: 200 })
}
