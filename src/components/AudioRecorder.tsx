import { CircleRounded, DoneRounded, MicRounded } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

type AudioRecorderProps = {
	onRecorded: (blob: Blob) => void
}

export default function AudioRecorder({ onRecorded }: AudioRecorderProps) {
	const [isRecording, setIsRecording] = useState<boolean>(false)
	const [recordingTime, setRecordingTime] = useState<number>(0) // Время записи в секундах
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const audioChunks = useRef<Blob[]>([])
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	const startRecording = async () => {
		try {
			const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			})
			mediaRecorderRef.current = new MediaRecorder(stream)

			mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
				audioChunks.current.push(event.data)
			}

			mediaRecorderRef.current.onstop = () => {
				const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' })
				onRecorded(audioBlob)
				audioChunks.current = []
				stopTimer()
			}

			mediaRecorderRef.current.start()
			setIsRecording(true)
			startTimer()
		} catch (error) {
			console.error('Error accessing microphone: ', error)
		}
	}

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop()
			setIsRecording(false)
		}
	}

	const startTimer = () => {
		setRecordingTime(0)
		timerRef.current = setInterval(() => {
			setRecordingTime(prevTime => prevTime + 1)
		}, 1000)
	}

	const stopTimer = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current)
			timerRef.current = null
		}
	}

	useEffect(() => {
		return () => stopTimer()
	}, [])

	const formatTime = (timeInSeconds: number): string => {
		const minutes = Math.floor(timeInSeconds / 60)
		const seconds = timeInSeconds % 60
		const paddedMinutes = String(minutes).padStart(2, '0')
		const paddedSeconds = String(seconds).padStart(2, '0')
		return `${paddedMinutes}:${paddedSeconds}`
	}

	return (
		<div>
			{!isRecording && (
				<IconButton onClick={startRecording}>
					<MicRounded />
				</IconButton>
			)}
			{isRecording && (
				<motion.div
					className='flex gap-2 items-center bg-softgray px-2 py-1 rounded-full'
					initial={{ x: 10, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
				>
					<motion.div
						className='mb-1'
						initial={{ scale: 0.8 }}
						animate={{ scale: 0.9 }}
						transition={{
							duration: 1,
							repeat: Infinity,
							repeatType: 'reverse',
							ease: 'easeInOut',
						}}
					>
						<CircleRounded fontSize='small' color='primary' />
					</motion.div>
					<span className='text-sm font-semibold'>{formatTime(recordingTime)}</span>
					<IconButton size='small' onClick={stopRecording}>
						<DoneRounded fontSize='small' />
					</IconButton>
				</motion.div>
			)}
		</div>
	)
}
