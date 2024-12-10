import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	differenceInWeeks,
	format,
} from 'date-fns'
import { ru } from 'date-fns/locale'

export default function dateToRelativeString(date: Date): string {
	const now = new Date()
	const minutesAgo = differenceInMinutes(now, date)
	const hoursAgo = differenceInHours(now, date)
	const daysAgo = differenceInDays(now, date)
	const weeksAgo = differenceInWeeks(now, date)

	if (minutesAgo < 1) {
		return 'Только что'
	} else if (minutesAgo < 60) {
		return `${minutesAgo} ${getPlural(
			minutesAgo,
			'минута',
			'минуты',
			'минут'
		)} назад`
	} else if (hoursAgo < 24) {
		return `${hoursAgo} ${getPlural(hoursAgo, 'час', 'часа', 'часов')} назад`
	} else if (daysAgo < 7) {
		return `${daysAgo} ${getPlural(daysAgo, 'день', 'дня', 'дней')} назад`
	} else if (weeksAgo < 4) {
		return `${weeksAgo} ${getPlural(
			weeksAgo,
			'неделя',
			'недели',
			'недель'
		)} назад`
	} else {
		return format(date, 'd MMMM yyyy', { locale: ru })
	}
}

// Функция для правильного склонения
function getPlural(
	n: number,
	singular: string,
	few: string,
	many: string
): string {
	const mod10 = n % 10
	const mod100 = n % 100

	if (mod100 >= 11 && mod100 <= 19) {
		return many
	}
	if (mod10 === 1) {
		return singular
	}
	if (mod10 >= 2 && mod10 <= 4) {
		return few
	}
	return many
}
