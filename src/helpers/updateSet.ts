export const updateSet = (
	value: Set<string>,
	item: string | string[],
	action: 'add' | 'delete'
): Set<string> => {
	const updatedSet = new Set(value)
	if (action === 'add') {
		if (Array.isArray(item)) {
			item.forEach(v => updatedSet.add(v))
		} else {
			updatedSet.add(item)
		}
	} else if (Array.isArray(item)) {
		item.forEach(v => updatedSet.delete(v))
	} else {
		updatedSet.delete(item)
	}
	return updatedSet
}
