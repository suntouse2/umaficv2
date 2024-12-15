import mediaTypeToText from '@helpers/mediaToText'
import { CloseRounded, ReplyRounded } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { motion } from 'motion/react'

type ReplyMessageProps = {
	message: TChatMessage
	onClose: () => void
}

export default function ReplyMessage({ message, onClose }: ReplyMessageProps) {
	return (
		<motion.div
			initial={{ y: 5, opacity: 0 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ y: 10, opacity: 0 }}
			transition={{ duration: 0.1 }}
			className='flex gap-2 items-center justify-between p-2 border-t border-border'
		>
			<div className='flex items-center gap-2'>
				<ReplyRounded color='primary' />
				<div className='border-l-2 pl-2 border-primary'>
					<span className='text-xs font-semibold text-primary'>Ответ на сообщение</span>
					<p className='text-sm break-all w-full'>
						{message.content.message}
						{!message.content.message &&
							message.content.media &&
							mediaTypeToText(message.content.media.type)}
					</p>
				</div>
			</div>
			<IconButton onClick={onClose}>
				<CloseRounded />
			</IconButton>
		</motion.div>
	)
}
