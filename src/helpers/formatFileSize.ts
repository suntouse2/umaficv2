export function formatFileSize(size: number): string {
	if (size < 1024) {
		return `${size} Байт`
	} else if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(2)} Кб`
	} else {
		return `${(size / (1024 * 1024)).toFixed(2)} Мб`
	}
}
