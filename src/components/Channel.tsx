import { Delete } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'

type ChannelProps = {
	value: string
	onRemove: () => void
}
export default function Channel({ value, onRemove }: ChannelProps) {
	return (
		<div className='flex items-center justify-between p-3 border-[1px] border-softgray rounded-md'>
			<div className='flex items-center gap-3 '>
				<Avatar sx={{ width: 50, height: 50, opacity: 0.5 }} />
				<div className='flex flex-col'>
					<span className='font-semibold'>@{value}</span>
					<span className='text-sm'>Ожидает модерации</span>
				</div>
			</div>
			<IconButton onClick={onRemove}>
				<Delete />
			</IconButton>
		</div>
	)
}
