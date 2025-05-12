const min_budget = 10

export default function parseBudget(value: string | number) {
	let parsedValue = parseInt(value.toString(), 10)

	if (isNaN(parsedValue) || parsedValue < min_budget) {
		parsedValue = min_budget
	}

	return parsedValue
}
