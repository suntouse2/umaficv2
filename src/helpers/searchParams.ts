export default function searchParams(param: string): string | null {
	const queryParams = new URLSearchParams(window.location.search)
	const accessLink = queryParams.get(param)
	return accessLink
}
