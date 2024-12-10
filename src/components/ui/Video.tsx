import { Dialog } from '@mui/material'
import { memo, useEffect, useRef, useState } from 'react'

type VideoProps = {
	blob: string
}

export default memo(function Video({ blob }: VideoProps) {
	const [dialogState, setDialogState] = useState<boolean>(false)
	const [remainingTime, setRemainingTime] = useState<number>(0)
	const [isZooming, setIsZooming] = useState<boolean>(false)
	const videoRef = useRef<HTMLVideoElement | null>(null)

	useEffect(() => {
		const video = videoRef.current
		if (video) {
			const handleTimeUpdate = () => {
				const duration = video.duration || 0
				const currentTime = video.currentTime
				setRemainingTime(Math.max(duration - currentTime, 0))
			}
			video.addEventListener('timeupdate', handleTimeUpdate)

			return () => {
				video.removeEventListener('timeupdate', handleTimeUpdate)
			}
		}
	}, [])

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	const handleClick = () => {
		setIsZooming(true)
		setDialogState(true)
		setTimeout(() => {
			setIsZooming(false)
		}, 300)
	}

	return (
		<div className='relative w-full rounded-md h-full cursor-pointer'>
			<Dialog open={dialogState} onClose={() => setDialogState(false)}>
				<video className='w-full rounded-md h-full max-h-[900px]' autoPlay src={blob} controls></video>
			</Dialog>
			<span className='bg-[#000] absolute mt-2 ml-2 bg-opacity-50 py-1 text-xs text-white font-sans font-light px-2 rounded-md'>
				{formatTime(remainingTime)}
			</span>
			<video
				ref={videoRef}
				onClick={handleClick}
				className={`w-full h-full max-w-[300px] rounded-md transition-transform duration-300 ${
					isZooming ? 'scale-110' : ''
				}`}
				src={blob}
				autoPlay
				muted
				loop
			/>
		</div>
	)
})
