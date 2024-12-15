import { CameraAltRounded, DoneRounded } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

type VideoRecorderProps = {
	onRecorded: (blob: Blob) => void
}

export default function VideoRecorder({ onRecorded }: VideoRecorderProps) {
	const [isRecording, setIsRecording] = useState<boolean>(false)
	const [recordingTime, setRecordingTime] = useState<number>(0)
	const [stream, setStream] = useState<MediaStream | null>(null)
	const mediaRecorderRef = useRef<MediaRecorder | null>(null)
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const videoChunks = useRef<Blob[]>([])
	const timerRef = useRef<NodeJS.Timeout | null>(null)

	const startRecording = async () => {
		try {
			const userStream: MediaStream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			})
			setStream(userStream)

			if (videoRef.current) {
				videoRef.current.srcObject = userStream
				videoRef.current.play()
			}

			mediaRecorderRef.current = new MediaRecorder(userStream)
			mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
				videoChunks.current.push(event.data)
			}

			mediaRecorderRef.current.onstop = () => {
				const videoBlob = new Blob(videoChunks.current, { type: 'video/mp4' })
				onRecorded(videoBlob)
				videoChunks.current = []
				stopTimer()
			}

			mediaRecorderRef.current.start()
			setIsRecording(true)
			startTimer()
		} catch (error) {
			console.error('Error accessing camera and microphone: ', error)
		}
	}

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop()
			setIsRecording(false)
		}
		if (stream) {
			stream.getTracks().forEach(track => track.stop())
			setStream(null)
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
		return () => {
			stopTimer()
			if (stream) {
				stream.getTracks().forEach(track => track.stop())
			}
		}
	}, [stream])

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
					<CameraAltRounded />
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
						<span className='text-sm font-semibold'>{formatTime(recordingTime)}</span>
					</motion.div>
					<IconButton size='small' onClick={stopRecording}>
						<DoneRounded fontSize='small' />
					</IconButton>
				</motion.div>
			)}
			<div className='mt-2'>
				<video ref={videoRef} className='w-full rounded-md' muted />
			</div>
		</div>
	)
}
