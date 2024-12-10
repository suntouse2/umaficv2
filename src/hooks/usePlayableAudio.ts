import { useCallback, useEffect, useRef, useState } from 'react'

type UseAudioPlayableProps = {
	audioRef: React.RefObject<HTMLAudioElement>
	handlePlay: () => void
	currentTime: number
	remainingTime: number
	isPlaying: boolean
}

export const usePlayableAudio = (): UseAudioPlayableProps => {
	const audioRef = useRef<HTMLAudioElement | null>(null)
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [remainingTime, setRemainingTime] = useState(0)

	const handlePlay = useCallback(() => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause()
			} else {
				audioRef.current.play()
			}
			setIsPlaying(!isPlaying)
		}
	}, [isPlaying])

	useEffect(() => {
		if (!audioRef.current) return

		const updateMetadata = () => {
			if (audioRef.current) {
				const duration = audioRef.current.duration || 0
				setRemainingTime(duration)
			}
		}

		const updateTime = () => {
			if (audioRef.current) {
				const duration = audioRef.current.duration || 0
				const currentTime = audioRef.current.currentTime
				setCurrentTime(currentTime)
				setRemainingTime(Math.max(duration - currentTime, 0))
			}
		}

		const audioElement = audioRef.current
		audioElement.addEventListener('loadedmetadata', updateMetadata)
		audioElement.addEventListener('timeupdate', updateTime)

		return () => {
			audioElement.removeEventListener('loadedmetadata', updateMetadata)
			audioElement.removeEventListener('timeupdate', updateTime)
		}
	}, [])

	return {
		audioRef,
		handlePlay,
		currentTime,
		remainingTime,
		isPlaying,
	}
}
