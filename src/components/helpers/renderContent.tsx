import Photo from '@components/common/Photo'
import RoundVideo from '@components/ui/RoundVideo'
import Video from '@components/ui/Video'
import Voice from '@components/ui/Voice'
import { formatFileSize } from '@helpers/formatFileSize'
import { Download } from '@mui/icons-material'

export const renderContent = (
	blobUrl: string | null,
	file: File,
	mediaType?: TMediaTypes
) => {
	if (!blobUrl) return null
	const fileType = file.type.split('/')[0]
	if (mediaType === 'voice') {
		return <Voice audioFile={file} blob={blobUrl} />
	} else if (mediaType === 'round') {
		return <RoundVideo blob={blobUrl} />
	} else if (file.type === 'application/octet-stream' || fileType === 'image') {
		return <Photo blob={blobUrl} />
	} else if (file.type === 'video/webm') {
		return (
			<video
				loop
				autoPlay
				muted
				className='w-full h-full overflow-hidden'
				src={blobUrl}
			></video>
		)
	} else if (fileType === 'video' && (mediaType === 'auto' || mediaType === 'document')) {
		return <Video blob={blobUrl} />
	} else if (fileType === 'audio') {
		return <audio controls src={blobUrl} />
	} else {
		return (
			<div className=''>
				<span className='flex items-center gap-2 bg-[#000] mt-2 ml-2 bg-opacity-50 py-1 text-xs text-white font-sans font-light px-2 rounded-md'>
					{file.name}
					<span className='text-[10px]'>{formatFileSize(file.size)}</span>
					<a href={blobUrl} download={file.name}>
						<Download />
					</a>
				</span>
			</div>
		)
	}
}
