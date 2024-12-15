import MediaRenderer from '@components/MediaRenderer'
import SmallLoader from '@components/ui/SmallLoader'
import dateToRelativeString from '@helpers/dateToRelativeString'
import { ReplyRounded } from '@mui/icons-material'
import { Button, Popover } from '@mui/material'
import { motion } from 'motion/react'
import { MouseEvent, useEffect, useState } from 'react'
import { useChatStore } from '../../store/chatStore'
import ForwardedMessage from './ForwardedMessage'

type MessageProps = {
	message: TChatMessage
	onReply: (message: TChatMessage) => void
}

export default function Message({ message, onReply }: MessageProps) {
	const readMessage = useChatStore(state => state.readMessage)
	const text = message.content.message
	const media = message.content.media
	const isSending = Boolean(message.catch_slug)
	const date = dateToRelativeString(new Date(message.date ?? ''))
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	useEffect(() => {
		if (message.is_read == false) readMessage(message.id)
	}, [message.id, message.is_read, readMessage])

	const handleContextOpen = (e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		if (!message.catch_slug) setAnchorEl(e.currentTarget)
	}
	const handleReply = () => {
		onReply(message)
		setAnchorEl(null)
	}

	return (
		<>
			<div className={`w-full flex ${message.is_self ? 'justify-end' : 'justify-start'}`}>
				<motion.div
					onContextMenu={handleContextOpen}
					className={`w-max max-w-80 ${
						message.is_self ? 'bg-primary bg-opacity-20' : 'bg-softgray'
					} rounded-xl px-4 py-2`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
				>
					<ForwardedMessage message={message.forwarded_message} />
					<p className={`w-full break-words`}>{text}</p>
					<div className='flex justify-end mt-2'>
						{isSending && <SmallLoader className='fill-softgray white text-softgray3' />}
						{!isSending && <span className={`text-xs text-softgray3`}>{date}</span>}
					</div>
					<MediaRenderer media={media} />
				</motion.div>
			</div>
			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<Button onClick={handleReply} className='flex items-center gap-2 text-sm'>
					<ReplyRounded /> Ответить
				</Button>
			</Popover>
		</>
	)
}
