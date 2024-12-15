import dateToRelativeString from '@helpers/dateToRelativeString'
import mediaTypeToText from '@helpers/mediaToText'
import { stringAvatar } from '@helpers/stringAvatar'
import { Avatar } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import { memo } from 'react'
import { useChatStore } from '../../store/chatStore'

type DirectProps = {
	direct: TChatDirect
	onClick: () => void
}
export default memo(function Direct({ direct, onClick }: DirectProps) {
	const directId = useChatStore(state => state.direct?.id)
	const message = direct.last_message.content.message
	const media = direct.last_message.content.media
	const user = `${direct.user.first_name ?? ''} ${direct.user.last_name ?? ''}`.slice(
		0,
		20
	)
	const isUnRead = direct.unread_count > 0
	const date = dateToRelativeString(new Date(direct.last_message.date ?? ''))
	return (
		<div>
			<div
				onClick={onClick}
				className={`relative cursor-pointer border-b border-border flex gap-2 items-start overflow-hidden px-2 py-2 w-full h-20 transition-[background]  ${
					direct.id == directId && 'bg-softgray'
				}`}
			>
				<Avatar {...stringAvatar(direct.user.first_name)} />
				<div className='flex flex-col w-full h-full overflow-hidden'>
					<div className='flex gap-2  justify-between text-softgray4'>
						<b className='text-sm text-nowrap'>{user}</b>
						<span className='text-[12px] text-nowrap'>{date}</span>
					</div>
					<div className='flex gap-2 w-full h-full overflow-hidden'>
						<p className='w-full h-full  overflow-hidden text-ellipsis text-sm'>
							{message}
							{!message && media && mediaTypeToText(media.type)}
						</p>
						<AnimatePresence>
							{isUnRead && (
								<div className='flex h-full items-center'>
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										exit={{ scale: 0 }}
										className='bg-primary bg-opacity-20 min-w-6 w-auto h-6 p-2 rounded-full flex justify-center items-center text-xs text-softgray4 '
									>
										{direct.unread_count}
									</motion.div>
								</div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</div>
	)
})
