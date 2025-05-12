import { format, isThisYear, isToday } from 'date-fns'
import { ru } from 'date-fns/locale'

export default function dateToString(date: Date): string {
	const isDateToday = isToday(date)
	const isDateThisYear = isThisYear(date)
	if (isDateToday) {
		return format(date, 'HH:mm', { locale: ru })
	}
	if (isDateThisYear) {
		return format(date, 'd MMMM HH:mm', { locale: ru })
	}
	return format(date, 'HH:MM d MMMM yyyy', { locale: ru })
}
