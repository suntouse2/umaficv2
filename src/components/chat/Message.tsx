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
	const directName = useChatStore(state => state.direct?.user)
	const author = message.is_self
		? 'Вы'
		: (directName?.first_name ?? '') + ' ' + (directName?.last_name ?? '')
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
			<motion.div
				onContextMenu={handleContextOpen}
				className={`flex flex-col w-full p-2`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<div className='w-full flex justify-between items-center'>
					<b className={`${message.is_self && 'text-secondary'}`}>{author}</b>
					<div className='flex items-center gap-2'>
						{isSending && <SmallLoader className='fill-softgray text-softgray3' />}
						{!isSending && <span className='text-xs text-softgray3'>{date}</span>}
					</div>
				</div>
				<ForwardedMessage message={message.forwarded_message} />
				<p className='w-full break-all'>{text}</p>
				<MediaRenderer media={media} />
			</motion.div>
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
