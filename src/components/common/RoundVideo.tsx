import { memo, useEffect, useRef, useState } from 'react'

export default memo(function RoundVideo({ blob }: { blob: string }) {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [progress, setProgress] = useState<number>(562)

	const updateProgress = () => {
		const video = videoRef.current
		if (video && video.duration) {
			const progressPercentage = (video.currentTime / video.duration) * 100
			const maxProgress = 562
			const offset = (maxProgress * (100 - progressPercentage)) / 100
			setProgress(offset)
		}
	}

	const renderVideo = () => {
		const video = videoRef.current
		const canvas = canvasRef.current
		if (!canvas) return
		const context = canvas.getContext('2d')
		if (video && !video.paused && !video.ended && canvas && context) {
			context.drawImage(video, 0, 0, canvas.width, canvas.height)
			updateProgress()
			if (!video.paused) requestAnimationFrame(renderVideo)
		}
	}
	useEffect(() => {
		const video = videoRef.current
		const canvas = canvasRef.current
		const context = canvas?.getContext('2d')

		if (video && canvas && context) {
			video.addEventListener(
				'loadedmetadata',
				() => {
					if (video.readyState >= 2) {
						video.currentTime = 0
						video.pause()
						video.requestVideoFrameCallback(() => {
							context.drawImage(video, 0, 0, canvas.width, canvas.height)
						})
					}
				},
				{ once: true }
			)
		}
		return () => {
			if (video) {
				video.removeEventListener('loadedmetadata', () => {})
			}
		}
	}, [])
	const handleClick = () => {
		const video = videoRef.current
		if (!video) return
		if (video.paused) {
			video.play()
			renderVideo()
		} else video.pause()
	}

	return (
		<div
			onClick={handleClick}
			className='relative w-[190px] h-[190px] overflow-hidden bg-[gray] rounded-[50%]'
		>
			<video
				playsInline
				ref={videoRef}
				style={{ display: 'none' }}
				className={'absolute w-full h-full !object-fill z-0;'}
				src={blob}
			></video>

			<canvas
				ref={canvasRef}
				width='320'
				height='180'
				className={'absolute w-full h-full !object-fill z-0;'}
			></canvas>
			<svg
				className={'absolute z-[3] opacity-70;'}
				width='190'
				height='190'
				style={{ transform: 'rotate(-90deg)' }}
			>
				<circle
					className='stroke-white'
					r='90'
					cx='95'
					cy='95'
					strokeWidth='3'
					strokeLinecap='round'
					strokeDashoffset={`${progress}px`}
					fill='transparent'
					strokeDasharray='562.8000000000001px'
				></circle>
			</svg>
		</div>
	)
})
