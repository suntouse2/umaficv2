export function areEqualArrays(
	a1: string[] | undefined,
	a2: string[] | undefined
): boolean {
	if (a1 === a2) return true
	if (a1 == null || a2 == null) return false
	if (a1.length !== a2.length) return false
	const sortedArr1 = arr1.slice().sort()
	const sortedArr2 = arr2.slice().sort()

	return true
}
