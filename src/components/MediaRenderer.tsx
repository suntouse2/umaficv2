import useMediaService from '@hooks/useMediaService'
import { Close } from '@mui/icons-material'
import { Skeleton } from '@mui/material'
import { motion } from 'motion/react'
import { memo, useEffect, useState } from 'react'
import FileViewer from './ui/FileViewer'

export default memo(function MediaRenderer({
	media,
	onRemove,
}: {
	media: TFunnelMessage['media']
	onRemove?: () => void
}) {
	const [file, setFile] = useState<File | null>(null)
	const { getFile } = useMediaService()

	useEffect(() => {
		const fetchFile = async () => {
			if (!media) return
			setFile(null)
			const file = await getFile(media.filepath)
			setFile(file)
		}
		fetchFile()
	}, [getFile, media])

	if (!media) return

	return (
		<div className='relative flex group items-start gap-2'>
			{!file && media.type == 'round' && (
				<Skeleton animation='wave' variant='circular' width={190} height={190} />
			)}
			{file && (
				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					onClick={e => e.stopPropagation()}
				>
					<FileViewer file={file} mediaType={media.type} />
				</motion.div>
			)}
			{onRemove && (
				<div
					onClick={onRemove}
					className='bg-[#000] bg-opacity-50 text-xs font-sans font-light !rounded-md cursor-pointer'
				>
					<Close fontSize='small' className='text-white' />
				</div>
			)}
		</div>
	)
})
