import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	differenceInWeeks,
	format,
	formatDistance,
} from 'date-fns'
import { ru } from 'date-fns/locale'

export default function dateToRelativeString(date: Date): string {
	const now = new Date()
	const minutesAgo = differenceInMinutes(now, date)
	const hoursAgo = differenceInHours(now, date)
	const daysAgo = differenceInDays(now, date)
	const weeksAgo = differenceInWeeks(now, date)

	if (minutesAgo < 1) {
		return 'Только что..'
	} else if (minutesAgo < 60) {
		return formatDistance(date, now, { locale: ru, addSuffix: true })
	} else if (hoursAgo < 24) {
		return formatDistance(date, now, { locale: ru, addSuffix: true })
	} else if (daysAgo < 7) {
		return formatDistance(date, now, { locale: ru, addSuffix: true })
	} else if (weeksAgo < 4) {
		return formatDistance(date, now, { locale: ru, addSuffix: true })
	} else {
		return format(date, 'd MMMM yyyy', { locale: ru })
	}
}
