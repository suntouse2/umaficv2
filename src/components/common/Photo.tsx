import { Dialog } from '@mui/material'
import { memo, useState } from 'react'

type VideoProps = {
	blob: string
}

export default memo(function Photo({ blob }: VideoProps) {
	const [dialogState, setDialogState] = useState<boolean>(false)
	const [isZooming, setIsZooming] = useState<boolean>(false)

	const handleClick = () => {
		setIsZooming(true)
		setDialogState(true)
		setTimeout(() => {
			setIsZooming(false)
		}, 300)
	}

	return (
		<div className='relative w-full h-full cursor-pointer'>
			<Dialog open={dialogState} onClose={() => setDialogState(false)}>
				<img className='w-full h-full' src={blob} />
			</Dialog>
			<img
				onClick={handleClick}
				src={blob}
				className={`w-full h-full max-w-[200px] rounded-md transition-transform duration-300 ${
					isZooming ? 'scale-110' : ''
				}`}
			/>
		</div>
	)
})
