import {
	DescriptionRounded,
	GraphicEq,
	InsertPhotoRounded,
	PanoramaFishEye,
	VideocamRounded,
} from '@mui/icons-material'
import { Popover } from '@mui/material'
import { memo } from 'react'

type FileSelectMenuProps = {
	anchorEl: null | HTMLElement
	onClose: () => void
	onClick: (type: TMediaTypes) => void
}

export default memo(function FileSelectMenu({
	anchorEl,
	onClick,
	onClose,
}: FileSelectMenuProps) {
	return (
		<Popover
			anchorEl={anchorEl}
			open={Boolean(anchorEl)}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			onClose={onClose}
		>
			<div className='bg-inputbg py-1'>
				<button
					className='p-2 pr-10  hover:text-secondary flex gap-2'
					onClick={() => onClick('round')}
				>
					<PanoramaFishEye />
					<span className='text-sm'>Кружочек</span>
				</button>
				<hr className='h-[1px] border-none bg-border' />
				<button
					className='p-2 pr-10  hover:text-secondary flex gap-2'
					onClick={() => onClick('round')}
				>
					<GraphicEq />
					<span className='text-sm'>Голосовое</span>
				</button>
				<hr className='h-[1px] border-none bg-border' />
				<button
					className='p-2 pr-10  hover:text-secondary flex gap-2'
					onClick={() => onClick('round')}
				>
					<InsertPhotoRounded />
					<span className='text-sm'>Фото</span>
				</button>
				<hr className='h-[1px] border-none bg-border' />
				<button
					className='p-2 pr-10  hover:text-secondary flex gap-2'
					onClick={() => onClick('round')}
				>
					<VideocamRounded />
					<span className='text-sm'>Видео</span>
				</button>
				<hr className='h-[1px] border-none bg-border' />
				<button
					className='p-2 pr-10  hover:text-secondary flex gap-2'
					onClick={() => onClick('round')}
				>
					<DescriptionRounded />
					<span className='text-sm'>Файл</span>
				</button>
			</div>
		</Popover>
	)
})
