import MediaRenderer from '@components/MediaRenderer'
import { AutoAwesome, Delete, Edit } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { motion } from 'motion/react'
import { FunnelyMessage as FunnelyMessageType } from './Funnely'
import Tagger from './Tagger'

type FunnelMessageProps = {
	message: FunnelyMessageType
	className?: string
	onEdit: () => void
	onChange: (value: Partial<FunnelyMessageType>) => void
	onRemove: () => void
	onAwesome: () => void
}

export default function FunnelyMessage({
	message,
	onEdit,
	onChange,
	onRemove,
	onAwesome,
	className,
}: FunnelMessageProps) {
	return (
		<motion.li
			layout
			initial={{ opacity: 0, y: 2 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -2 }}
			transition={{ duration: 0.2 }}
			className={`bg-inputbg rounded-md max-w-full px-4 pb-4 pt-2 overflow-hidden ${className}`}
			style={{ cursor: 'pointer' }}
		>
			<div className='flex justify-end items-center mb-2'>
				<IconButton onClick={onAwesome}>
					<AutoAwesome />
				</IconButton>
				<IconButton onClick={onEdit}>
					<Edit />
				</IconButton>
				<IconButton onClick={onRemove}>
					<Delete />
				</IconButton>
			</div>
			<p className='break-words max-w-full mb-4'>{message.message.message}</p>
			{message.message.media && <MediaRenderer media={message.message.media} />}
			{message.type == 'order' && Number.isInteger(message.filter) && (
				<span className='flex text-sm items-center gap-2'>
					<i>{message.filter as number}</i> по порядку
				</span>
			)}
			{message.type == 'keyword' &&
				message.filter &&
				typeof message.filter == 'object' && (
					<span className='flex text-sm items-center gap-2'>
						<Tagger
							inputVariant='hide'
							tagClassName='bg-white border-[1px] border-border'
							className='bg-inputbg !w-full mb-2'
							activeTags={message.filter}
							selectable={false}
							onChange={v => {
								onChange({
									filter: v,
								})
							}}
						/>
					</span>
				)}
		</motion.li>
	)
}
