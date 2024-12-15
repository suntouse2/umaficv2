import { PropsWithChildren, useEffect, useRef } from 'react'
import { useChatStore } from '../../store/chatStore'

type ChatWrapperProps = {
	campaignId: number
	directId: null | number
} & PropsWithChildren
export default function ChatWrapper({
	children,
	campaignId,
	directId,
}: ChatWrapperProps) {
	const wsRef = useRef<WebSocket | null>(null)

	const setCampaignId = useChatStore(state => state.setCampaignId)
	const currentCampaignId = useChatStore(state => state.campaignId)
	const fetchDirect = useChatStore(state => state.fetchDirect)
	const updateMessage = useChatStore(state => state.updateMessage)
	const updateDirect = useChatStore(state => state.updateDirect)
	useEffect(() => {
		const wsUrl = `${
			import.meta.env.VITE_WS_URL
		}/directs/messages?campaign_id=${campaignId}&token=${localStorage.getItem(
			'access_token'
		)}`
		const ws = new WebSocket(wsUrl)
		wsRef.current = ws

		ws.onmessage = event => {
			const data: TWSIncomingMessage = JSON.parse(event.data)
			updateMessage(data)
			updateDirect(data.direct_id)
		}
		ws.onopen = () => {
			console.log('ws connected')
		}
		ws.onerror = error => {
			console.error('WebSocket error:', error)
		}
		ws.onclose = () => {
			console.log('WebSocket connection closed')
		}

		return () => {
			if (wsRef.current) {
				console.log('websocket disconnected')

				wsRef.current.close()
			}
		}
	}, [campaignId, updateDirect, updateMessage])

	useEffect(() => {
		setCampaignId(campaignId)
		if (directId) {
			fetchDirect(directId)
		}
	}, [campaignId, setCampaignId, directId, fetchDirect])

	if (currentCampaignId !== campaignId) return <></>

	return <>{children}</>
}
