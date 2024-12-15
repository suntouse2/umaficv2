import TextArea from '@components/common/TextArea'
import MediaRenderer from '@components/MediaRenderer'
import MediaUploader from '@components/MediaUploader'
import Tagger from '@components/Tagger'
import useMediaService from '@hooks/useMediaService'
import { Message } from '@mui/icons-material'
import { Button } from '@mui/material'
import { motion } from 'motion/react'
import { nanoid } from 'nanoid'
import { KeyboardEvent, useState } from 'react'
import AudioRecorder from './AudioRecorder'
import Input from './common/Input'
import { FunnelyMessage } from './Funnely'

type FunnelyEditorProps = {
	type: FunnelyMessage['type']
	message: FunnelyMessage | null
	onDone: (payload: FunnelyMessage) => void
}

export default function FunnelyEditor({ message, type, onDone }: FunnelyEditorProps) {
	const [payload, setPayload] = useState<FunnelyMessage>(() => ({
		id: message?.id || nanoid(),
		type: message?.type || type,
		filter: message?.filter || (type === 'keyword' ? [] : type === 'order' ? 2 : null),
		message: message?.message || { message: '', media: null },
	}))

	const disabled =
		(type == 'keyword' && Array.isArray(payload.filter) && payload.filter.length == 0) ||
		(payload.message.message.length == 0 && payload.message.media == null)

	const updatePayload = (key: keyof FunnelyMessage, value: unknown) => {
		setPayload(prev => ({ ...prev, [key]: value }))
	}
	const { uploadFile } = useMediaService()
	const handleTextAreaEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.code == 'Enter') {
			e.preventDefault()
			e.stopPropagation()
			return handleDone()
		}
	}
	const handleDone = () => {
		if (disabled) return
		onDone(payload)
	}
	const handleAudioUpload = async (blob: Blob) => {
		const file = new File([blob], `audio_${nanoid()}`)
		const filepath = await uploadFile(file)
		updatePayload('message', {
			...payload.message,
			media: {
				filepath,
				type: 'voice',
			},
		})
	}

	return (
		<motion.article className='p-4 min-w-[360px] border border-border flex flex-col gap-3'>
			<h2 className='font-bold flex gap-2 items-center text-xl mb-4'>
				<Message /> {message ? 'Сообщение' : 'Новое сообщение'}
			</h2>
			{payload.type === 'order' && (
				<Input
					type='number'
					minNumber={2}
					maxNumber={98}
					onlyDigits
					value={String(payload.filter)}
					onChange={v => updatePayload('filter', parseInt(v))}
				/>
			)}
			{payload.type === 'keyword' && Array.isArray(payload.filter) && (
				<Tagger
					inputVariant='visible'
					selectable={false}
					className='bg-inputbg !w-full mb-2'
					activeTags={payload.filter}
					onChange={v => updatePayload('filter', v)}
				/>
			)}
			<TextArea
				placeholder='Сообщение'
				className='h-[180px] bg-white border border-border'
				maxLength={4096}
				onKeyDown={handleTextAreaEnter}
				value={payload.message.message}
				onChange={v => updatePayload('message', { ...payload.message, message: v })}
			/>

			<MediaRenderer
				media={payload.message.media}
				onRemove={() => updatePayload('message', { ...payload.message, media: null })}
			/>
			<div className='flex justify-end gap-2'>
				<AudioRecorder onRecorded={handleAudioUpload} />
				<MediaUploader
					onMediaUploaded={media =>
						updatePayload('message', { ...payload.message, media })
					}
				/>
				<Button
					disabled={disabled}
					type='button'
					onClick={handleDone}
					variant='outlined'
					color='primary'
				>
					{message ? 'Изменить' : 'Добавить'}
				</Button>
			</div>
		</motion.article>
	)
}
