import { MutableRefObject, RefObject, useEffect, useState } from 'react'

export default function useSetInitialScroll(
	ref: RefObject<HTMLElement>,
	userScrolled: MutableRefObject<boolean>
) {
	const [observer, setObserver] = useState<MutationObserver | null>(null)

	useEffect(() => {
		if (!ref.current) return
		const el = ref.current
		const scrollToBottom = () => {
			el.scrollTop = el.scrollHeight
		}
		const handleScroll = () => {
			if (el.scrollTop + el.clientHeight < el.scrollHeight) {
				userScrolled.current = true
			}
		}
		el.addEventListener('scroll', handleScroll)
		const mutationObserver = new MutationObserver(() => {
			if (!userScrolled.current) {
				scrollToBottom()
			}
		})
		mutationObserver.observe(el, { childList: true, subtree: true })
		setObserver(mutationObserver)
		scrollToBottom()
		return () => {
			el.removeEventListener('scroll', handleScroll)
			if (observer) {
				observer.disconnect()
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref])

	return null
}
