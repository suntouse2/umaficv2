import useSetInitialScroll from '@hooks/useSetInitialScroll'
import { AnimatePresence } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useChatStore } from '../../store/chatStore'
import ChatDirect from './ChatDirect'
import ChatInput from './ChatInput'
import Message from './Message'
import ReplyMessage from './ReplyMessage'

export default function ChatScreen() {
	const messages = useChatStore(state => state.messages)
	const messagesQueue = useChatStore(state => state.messagesQueue)
	const fetchMessages = useChatStore(state => state.fetchMessages)
	const sendMessage = useChatStore(state => state.sendMessage)
	const direct = useChatStore(state => state.direct)
	const listRef = useRef<HTMLUListElement | null>(null)
	const userScrolled = useRef<boolean>(false)
	const messageSended = useRef<boolean>(false)
	useSetInitialScroll(listRef, userScrolled)
	const [replyMessage, setReplyMessage] = useState<TChatMessage | null>(null)
	const msgQueue = useMemo(
		() => messagesQueue.filter(msg => msg.direct_id == direct?.id),
		[messagesQueue, direct]
	)

	useEffect(() => {
		userScrolled.current = false
	}, [direct?.id])

	const { ref, inView } = useInView({
		root: listRef.current,
		rootMargin: '200px 0px 0px 0px',
	})

	const handleReply = useCallback((message: TChatMessage) => {
		setReplyMessage(message)
	}, [])

	const handleSend = useCallback(
		(message: TMessageContent) => {
			sendMessage({
				content: message,
				reply_to: replyMessage ? replyMessage.id : null,
			})
			setReplyMessage(null)
			messageSended.current = true
		},
		[replyMessage, sendMessage]
	)

	useEffect(() => {
		if (messageSended.current == true) {
			listRef.current?.scrollTo({
				top: listRef.current.scrollHeight,
				behavior: 'smooth',
			})
			messageSended.current = false
		}
	}, [messages, msgQueue])

	useEffect(() => {
		if (inView) fetchMessages()
	}, [inView, fetchMessages])

	return (
		<article className='flex border-t border-border flex-col w-full h-full overflow-hidden'>
			{direct && (
				<div className='w-full border-b-[1px] border-border bg-white'>
					<ChatDirect direct={direct} />
				</div>
			)}
			<ul className='flex flex-col w-full h-full p-2 gap-1 overflow-auto' ref={listRef}>
				<div ref={ref} className='h-[1px] bg-[transparent]'></div>
				{messages.map(msg => (
					<Message onReply={handleReply} key={msg.id} message={msg} />
				))}
				{msgQueue.map(msg => (
					<Message onReply={handleReply} key={msg.id} message={msg} />
				))}
			</ul>
			<AnimatePresence>
				{replyMessage && (
					<ReplyMessage onClose={() => setReplyMessage(null)} message={replyMessage} />
				)}
			</AnimatePresence>
			<ChatInput onSend={handleSend} />
		</article>
	)
}
