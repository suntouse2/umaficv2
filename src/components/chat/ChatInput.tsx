import AudioRecorder from '@components/AudioRecorder'
import TextArea from '@components/common/TextArea'
import MediaRenderer from '@components/MediaRenderer'
import MediaUploader from '@components/MediaUploader'
import useMediaService from '@hooks/useMediaService'
import { SendOutlined } from '@mui/icons-material'
import { Dialog } from '@mui/material'
import { nanoid } from 'nanoid'
import { KeyboardEvent, memo, useState } from 'react'

type ChatInputProps = {
	onSend: (content: TMessageContent) => void
}

export default memo(function ChatInput({ onSend }: ChatInputProps) {
	const [text, setText] = useState<string>('')
	const [media, setMedia] = useState<TMessageContent['media']>(null)
	const { uploadFile } = useMediaService()
	const handleInputEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (!e.shiftKey && e.key == 'Enter') {
			e.preventDefault()
			handleSend()
		}
	}

	const handleSend = () => {
		onSend({
			message: text,
			media: media,
		})
		setText('')
		setMedia(null)
	}

	const handleAudioUpload = async (blob: Blob) => {
		const file = new File([blob], `audio_${nanoid()}`)
		const filepath = await uploadFile(file)
		setMedia({
			filepath,
			type: 'voice',
		})
	}

	const Input = (
		<TextArea
			value={text}
			autoHeight={true}
			onKeyDown={handleInputEnter}
			className='bg-white p-0'
			placeholder='Введите сообщение...'
			onChange={setText}
			maxLength={4096}
		/>
	)

	const Submit = (
		<button
			onClick={handleSend}
			type='button'
			className='border-none active:scale-[0.8] transition-transform'
		>
			<SendOutlined color='primary' />
		</button>
	)

	return (
		<div
			onSubmit={e => {
				e.preventDefault()
			}}
			className='flex items-center px-2 pt-2 pb-1 bg-white border-t-[1px] border-border'
		>
			<div>
				<Dialog open={Boolean(media)} onClose={() => setMedia(null)}>
					<div className=''>
						<div className='p-4'>
							<MediaRenderer media={media} />
						</div>
						<hr className='border-border h-0' />
						<div className='px-2 py-1 flex items-center'>
							{Input}
							{Submit}
						</div>
					</div>
				</Dialog>
			</div>
			{Input}
			<AudioRecorder onRecorded={handleAudioUpload} />
			<div className='flex gap-2 items-center'>
				<MediaUploader onMediaUploaded={setMedia} />
				{Submit}
			</div>
		</div>
	)
})
