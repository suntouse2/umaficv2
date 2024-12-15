import {
	DescriptionRounded,
	GraphicEq,
	InsertPhotoRounded,
	PanoramaFishEye,
} from '@mui/icons-material'
import { Popover } from '@mui/material'
import { memo } from 'react'

type MediaSelectMenuProps = {
	anchorEl: null | HTMLElement
	onClose: () => void
	onClick: (type: TMediaTypes) => void
}

export default memo(function MediaSelectMenu({
	anchorEl,
	onClick,
	onClose,
}: MediaSelectMenuProps) {
	return (
		<Popover
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			slotProps={{
				paper: {
					sx: {
						borderRadius: 2,
					},
				},
			}}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			onClose={onClose}
		>
			<div className='bg-white py-1'>
				<button
					className='p-2 pr-10 transition-colors  hover:text-primary flex gap-2'
					onClick={() => onClick('round')}
				>
					<PanoramaFishEye />
					<span className='text-sm'>Кружочек</span>
				</button>
				<hr className='h-[1px] border-none bg-border' />
				<button
					className='p-2 pr-10 transition-colors  hover:text-primary flex gap-2'
					onClick={() => onClick('voice')}
				>
					<GraphicEq />
					<span className='text-sm'>Голосовое</span>
				</button>
				<hr className='h-[1px] border-none bg-border' />
				<button
					className='p-2 pr-10 transition-colors   hover:text-primary flex gap-2'
					onClick={() => onClick('auto')}
				>
					<InsertPhotoRounded />
					<span className='text-sm'>Фото или видео</span>
				</button>

				<hr className='h-[1px] transition-colors  border-none bg-border' />
				<button
					className='p-2 pr-10  hover:text-primary flex gap-2'
					onClick={() => onClick('document')}
				>
					<DescriptionRounded />
					<span className='text-sm'>Файл</span>
				</button>
			</div>
		</Popover>
	)
})
