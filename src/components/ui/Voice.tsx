import { usePlayableAudio } from '@hooks/usePlayableAudio'
import { Pause, PlayArrow } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { memo, useMemo } from 'react'
import { AudioVisualizer } from 'react-audio-visualize'
type VoiceProps = {
	audioFile: File
	blob: string
}

export default memo(function Voice({ audioFile, blob }: VoiceProps) {
	const theme = useTheme()

	const blobBlob = useMemo(
		() => new Blob([audioFile], { type: audioFile.type }),
		[audioFile]
	)
	const { audioRef, handlePlay, currentTime, remainingTime, isPlaying } =
		usePlayableAudio()

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60)
		const seconds = Math.floor(time % 60)
		return `${minutes}:${seconds.toString().padStart(2, '0')}`
	}

	return (
		<div className='flex gap-2'>
			<div>
				<button
					className='text-white flex items-center justify-center bg-primary  w-[35px] h-[35px] rounded-full'
					type='button'
					onClick={handlePlay}
				>
					{isPlaying ? <Pause /> : <PlayArrow />}
				</button>
			</div>
			<div className='relative'>
				<AudioVisualizer
					blob={blobBlob}
					width={220}
					height={35}
					barWidth={2}
					gap={1}
					currentTime={currentTime}
					barPlayedColor={theme.palette.primary.main}
					barColor='gray'
				/>
				<audio src={blob} ref={audioRef} style={{ display: 'none' }}></audio>
				<span className=' text-primary text-xs font-sans font-lights absolute bottom-[-10px]'>
					{!isNaN(remainingTime) &&
						remainingTime !== Infinity &&
						formatTime(remainingTime)}
				</span>
			</div>
		</div>
	)
})
