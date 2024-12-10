export default function formatBalance(
	value: number | string | undefined
): string | undefined {
	if (value == undefined) return undefined
	const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
	if (formatted.length > 4) {
		const [integerPart, decimalPart] = formatted.split(',')
		return decimalPart ? `${integerPart} ${decimalPart}` : integerPart + ' ₽'
	}
	return formatted + ' ₽'
}
